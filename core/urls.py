from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, TaskViewSet, UserViewSet, CustomAuthToken, HealthView, RegisterView

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', CustomAuthToken.as_view(), name='api_token_auth'), # URL para obter token
    path('health/', HealthView.as_view(), name='api_health'),
    path('register/', RegisterView.as_view(), name='api_register'),
]