from rest_framework import viewsets
from apps.accounts.permission import AdminOrReadOnly
from .models import OurServices, AutismCount
from .serializers import OurServiceSerializer, AutismSerializer


class OurServicesViewset(viewsets.ModelViewSet):
    permission_classes = [AdminOrReadOnly]
    serializer_class = OurServiceSerializer
    queryset = OurServices.objects.all().order_by("-updated_at")

class AutismViewset(viewsets.ModelViewSet):
    permission_classes = [AdminOrReadOnly]
    serializer_class = AutismSerializer
    queryset = AutismCount.objects.all().order_by("-updated_at")
