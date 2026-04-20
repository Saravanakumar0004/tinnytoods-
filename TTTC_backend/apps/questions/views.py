from rest_framework.viewsets import ModelViewSet
from .models import Questions
from .serializer import QuestionSerializer
from apps.accounts.permission import AdminOrReadOnly


class QuestionViewset(ModelViewSet):
    permission_classes = [AdminOrReadOnly]
    serializer_class = QuestionSerializer

    queryset = Questions.objects.all().order_by("-updated_at")

