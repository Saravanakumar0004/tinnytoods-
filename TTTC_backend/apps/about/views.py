from rest_framework.viewsets import ModelViewSet
from .serializer import AboutSerializer
from apps.accounts.permission import AdminOrReadOnly
from .models import About

class AboutViewset(ModelViewSet):
    permission_classes = [AdminOrReadOnly]
    serializer_class = AboutSerializer
    queryset = About.objects.all().order_by("-updated_at")
    
