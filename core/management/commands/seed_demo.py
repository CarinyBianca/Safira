from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import Project, Task

class Command(BaseCommand):
    help = "Cria dados de demonstração: usuário demo, projeto e algumas tarefas"

    def handle(self, *args, **options):
        # Usuário demo
        demo_user, created_user = User.objects.get_or_create(
            username="demo",
            defaults={"email": "demo@example.com"}
        )
        if created_user:
            demo_user.set_password("demo123")
            demo_user.is_staff = True
            demo_user.is_superuser = True
            demo_user.save()
            self.stdout.write(self.style.SUCCESS("Usuário 'demo' criado com senha 'demo123' (admin)."))
        else:
            self.stdout.write("Usuário 'demo' já existe.")

        # Projeto demo
        project, created_project = Project.objects.get_or_create(
            name="Projeto Demo",
            defaults={"description": "Projeto de exemplo para apresentação."}
        )
        project.users.add(demo_user)
        project.save()
        if created_project:
            self.stdout.write(self.style.SUCCESS("Projeto 'Projeto Demo' criado."))
        else:
            self.stdout.write("Projeto 'Projeto Demo' já existe.")

        # Tarefas demo
        tasks_data = [
            {"title": "Configurar ambiente", "description": "Preparar dependências", "status": Task.STATUS_TODO, "priority": Task.PRIORITY_HIGH},
            {"title": "Criar primeiro projeto", "description": "Cadastrar Projeto Demo", "status": Task.STATUS_IN_PROGRESS, "priority": Task.PRIORITY_MEDIUM},
            {"title": "Cadastrar tarefas", "description": "Criar tarefas iniciais", "status": Task.STATUS_DONE, "priority": Task.PRIORITY_LOW},
        ]
        created_count = 0
        for data in tasks_data:
            t, created = Task.objects.get_or_create(
                project=project,
                title=data["title"],
                defaults={
                    "description": data["description"],
                    "assigned_to": demo_user,
                    "status": data["status"],
                    "priority": data["priority"],
                }
            )
            if created:
                created_count += 1
        self.stdout.write(self.style.SUCCESS(f"{created_count} tarefa(s) de demo criadas."))
        self.stdout.write(self.style.SUCCESS("Seed concluído."))
