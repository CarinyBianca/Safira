# core/admin.py
from django.contrib import admin
from .models import Project, Task # Importe seus modelos

# Registre seus modelos aqui
admin.site.register(Project)
admin.site.register(Task)