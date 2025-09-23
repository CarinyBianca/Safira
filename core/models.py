from django.db import models
from django.contrib.auth.models import User
# Create your models here.
# model projeto


class Project(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    # Relação Many-to-Many com o User, permite que vários usuários
    # estejam em vários projetos. 'related_name' permite referenciar
    # os projetos de um usuário (ex: user.projects.all()).
    users = models.ManyToManyField(User, related_name='projects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    # Usuário responsável (opcional). Recomendado que pertença ao projeto.
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='tasks', null=True, blank=True)

    # Status da tarefa
    STATUS_TODO = 'todo'
    STATUS_IN_PROGRESS = 'in_progress'
    STATUS_DONE = 'done'
    STATUS_CHOICES = [
        (STATUS_TODO, 'A Fazer'),
        (STATUS_IN_PROGRESS, 'Em Progresso'),
        (STATUS_DONE, 'Concluída'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_TODO)

    # Prioridade
    PRIORITY_LOW = 'low'
    PRIORITY_MEDIUM = 'medium'
    PRIORITY_HIGH = 'high'
    PRIORITY_CHOICES = [
        (PRIORITY_LOW, 'Baixa'),
        (PRIORITY_MEDIUM, 'Média'),
        (PRIORITY_HIGH, 'Alta'),
    ]
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default=PRIORITY_MEDIUM)

    # Campo legado, mantido por compatibilidade. Pode ser derivado de status == done.
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
