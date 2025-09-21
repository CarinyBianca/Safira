from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken import views # Importe isto para a URL de login default do DRF


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')), # Inclua as URLs da sua API aqui
    path('api-auth/', include('rest_framework.urls')), # Opcional: para login/logout no navegador do DRF
]