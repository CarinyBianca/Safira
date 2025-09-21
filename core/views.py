# backend/core/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Project, Task
from .serializers import ProjectSerializer, TaskSerializer, UserSerializer
from django.contrib.auth.models import User
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token


class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email
        })


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows users to be viewed.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser] # Apenas admins podem listar usuários

class ProjectViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows projects to be viewed or edited.
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated] # Apenas usuários autenticados podem acessar

    def get_queryset(self):
        """
        Retorna apenas os projetos aos quais o usuário autenticado pertence.
        """
        return self.request.user.projects.all()

    def perform_create(self, serializer):
        """
        Ao criar um projeto, associa automaticamente o usuário criador a ele.
        """
        project = serializer.save()
        project.users.add(self.request.user) # Adiciona o usuário atual ao projeto
        project.save()

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def add_user(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            if user not in project.users.all():
                project.users.add(user)
                return Response({'status': f'User {user.username} added to project {project.name}'})
            return Response({'status': f'User {user.username} already in project'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def remove_user(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            if user in project.users.all():
                project.users.remove(user)
                return Response({'status': f'User {user.username} removed from project {project.name}'})
            return Response({'status': f'User {user.username} not in project'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class TaskViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows tasks to be viewed or edited.
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Retorna apenas as tarefas de projetos aos quais o usuário autenticado pertence.
        """
        user_projects = self.request.user.projects.all()
        return Task.objects.filter(project__in=user_projects)

    def perform_create(self, serializer):
        """
        Garante que a tarefa seja criada para um projeto que o usuário autenticado
        tenha permissão para acessar.
        """
        project = serializer.validated_data['project']
        if project not in self.request.user.projects.all():
            raise PermissionDenied("Você não tem permissão para criar tarefas neste projeto.")
        serializer.save()