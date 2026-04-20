from rest_framework import viewsets
from apps.accounts.permission import AdminOrReadOnly
from .models import HomeStats
from .serializers import HomeStateSerializer


class HomeStatsViewSet(viewsets.ModelViewSet):
    permission_classes = [AdminOrReadOnly]
    serializer_class = HomeStateSerializer
    queryset = HomeStats.objects.all().order_by("-updated_at") 
