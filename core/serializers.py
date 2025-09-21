# backend/core/serializers.py
from rest_framework import serializers
from .models import Project, Task
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email') # Campos que você quer expor do User

class ProjectSerializer(serializers.ModelSerializer):
    # Para incluir os usernames dos usuários associados ao projeto
    users = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ('id', 'name', 'description', 'users', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at') # Estes campos serão definidos automaticamente

class TaskSerializer(serializers.ModelSerializer):
    # Para associar a tarefa a um projeto, você pode usar o id do projeto
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())
    # Opcional: para exibir o nome do projeto em vez do ID ao listar tarefas
    # project_name = serializers.CharField(source='project.name', read_only=True)

    class Meta:
        model = Task
        fields = ('id', 'project', 'title', 'description', 'completed', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')