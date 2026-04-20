from rest_framework import viewsets
from .models import Branches
from apps.accounts.permission import AdminOrReadOnly
from .serializer import BranchSerializer

class BranchViewset(viewsets.ModelViewSet):
    permission_classes = [AdminOrReadOnly]
    serializer_class = BranchSerializer
    queryset = Branches.objects.all().order_by("-updated_at")
