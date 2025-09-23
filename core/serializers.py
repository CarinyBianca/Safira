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
    assigned_to = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), allow_null=True, required=False)

    # Campos auxiliares de leitura
    project_name = serializers.CharField(source='project.name', read_only=True)
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True)

    class Meta:
        model = Task
        fields = (
            'id', 'project', 'project_name',
            'title', 'description',
            'assigned_to', 'assigned_to_username',
            'status', 'priority', 'completed',
            'created_at', 'updated_at',
        )
        read_only_fields = ('created_at', 'updated_at')

    def validate(self, attrs):
        project = attrs.get('project') or getattr(self.instance, 'project', None)
        assigned_to = attrs.get('assigned_to') if 'assigned_to' in attrs else getattr(self.instance, 'assigned_to', None)
        if assigned_to and project and assigned_to not in project.users.all():
            raise serializers.ValidationError('assigned_to precisa ser membro do projeto selecionado.')
        return attrs

    def _sync_completed(self, validated_data):
        status = validated_data.get('status')
        if status is not None:
            validated_data['completed'] = (status == 'done')
        return validated_data

    def create(self, validated_data):
        validated_data = self._sync_completed(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data = self._sync_completed(validated_data)
        return super().update(instance, validated_data)