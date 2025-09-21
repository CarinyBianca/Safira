from django.test import TestCase
from django.test import override_settings
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import Project, Task

TEST_DB = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

@override_settings(DATABASES=TEST_DB)
class AuthTests(APITestCase):
    def setUp(self):
        self.username = 'alice'
        self.password = 'alicepass'
        User.objects.create_user(username=self.username, password=self.password)
        self.url = reverse('api_token_auth')  # registered at core/urls.py as name='api_token_auth'

    def test_obtain_auth_token(self):
        resp = self.client.post(self.url, {"username": self.username, "password": self.password}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('token', resp.data)

@override_settings(DATABASES=TEST_DB)
class ProjectCrudTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='bob', password='bobpass')
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        self.project_list_url = reverse('project-list')

    def test_create_project_associates_creator(self):
        payload = {"name": "Proj A", "description": "desc"}
        resp = self.client.post(self.project_list_url, payload, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        # users is read-only nested; ensure current user is included
        self.assertTrue(any(u['username'] == self.user.username for u in resp.data.get('users', [])))
        # queryset is filtered by membership; ensure it is returned on list
        list_resp = self.client.get(self.project_list_url)
        self.assertEqual(list_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_resp.data), 1)

    def test_list_only_member_projects(self):
        # Project not associated with user
        p1 = Project.objects.create(name='P1')
        # Project associated
        p2 = Project.objects.create(name='P2')
        p2.users.add(self.user)
        resp = self.client.get(self.project_list_url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        names = [p['name'] for p in resp.data]
        self.assertNotIn(p1.name, names)
        self.assertIn(p2.name, names)

    def test_update_and_delete_project(self):
        p = Project.objects.create(name='P')
        p.users.add(self.user)
        detail_url = reverse('project-detail', args=[p.id])
        patch_resp = self.client.patch(detail_url, {"description": "updated"}, format='json')
        self.assertEqual(patch_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_resp.data['description'], 'updated')
        del_resp = self.client.delete(detail_url)
        self.assertEqual(del_resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Project.objects.filter(id=p.id).exists())

    def test_add_and_remove_user_actions(self):
        p = Project.objects.create(name='Team')
        p.users.add(self.user)
        other = User.objects.create_user(username='carol', password='carolpass')
        add_url = reverse('project-add-user', args=[p.id])
        rem_url = reverse('project-remove-user', args=[p.id])
        add_resp = self.client.post(add_url, {"user_id": other.id}, format='json')
        self.assertEqual(add_resp.status_code, status.HTTP_200_OK)
        self.assertIn(other, p.users.all())
        rem_resp = self.client.post(rem_url, {"user_id": other.id}, format='json')
        self.assertEqual(rem_resp.status_code, status.HTTP_200_OK)
        self.assertNotIn(other, p.users.all())

@override_settings(DATABASES=TEST_DB)
class TaskCrudPermissionTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='u1', password='p1')
        self.user2 = User.objects.create_user(username='u2', password='p2')
        self.p1 = Project.objects.create(name='Proj1')
        self.p2 = Project.objects.create(name='Proj2')
        self.p1.users.add(self.user1)
        self.p2.users.add(self.user2)
        self.client = APIClient()
        self.token1 = Token.objects.create(user=self.user1)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token1.key}')
        self.task_list_url = reverse('task-list')

    def test_create_task_in_own_project(self):
        payload = {"project": self.p1.id, "title": "T1", "description": "d"}
        resp = self.client.post(self.task_list_url, payload, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 1)
        self.assertEqual(Task.objects.first().project_id, self.p1.id)

    def test_cannot_create_task_in_foreign_project(self):
        payload = {"project": self.p2.id, "title": "T2"}
        resp = self.client.post(self.task_list_url, payload, format='json')
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_only_tasks_from_member_projects(self):
        # tasks in both projects
        Task.objects.create(project=self.p1, title='A')
        Task.objects.create(project=self.p2, title='B')
        resp = self.client.get(self.task_list_url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        titles = [t['title'] for t in resp.data]
        self.assertIn('A', titles)
        self.assertNotIn('B', titles)

@override_settings(DATABASES=TEST_DB)
class UserPermissionsTests(APITestCase):
    def setUp(self):
        self.regular = User.objects.create_user(username='regular', password='x')
        self.admin = User.objects.create_user(username='admin', password='x', is_staff=True)
        self.client = APIClient()
        self.users_url = reverse('user-list')

    def test_regular_user_forbidden(self):
        token = Token.objects.create(user=self.regular)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')
        resp = self.client.get(self.users_url)
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_user_allowed(self):
        token = Token.objects.create(user=self.admin)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')
        resp = self.client.get(self.users_url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
