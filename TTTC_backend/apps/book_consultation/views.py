from rest_framework import viewsets
from .serializer import BookSerializer
from .models import BookConsultation
from apps.accounts.permission import AdminOrCreateOnly

class BookViewset(viewsets.ModelViewSet):

    permisson_classes = [AdminOrCreateOnly]
    serializer_class = BookSerializer
    queryset = BookConsultation.objects.all().order_by("updated_at")

