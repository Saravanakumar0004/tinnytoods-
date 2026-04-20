from rest_framework import viewsets, permissions, filters
from .models import YoutubeVideo
from .serializer import YoutubeVideoSerializer
from apps.accounts.permission import AdminOrReadOnly

class YoutubeVideoViewSet(viewsets.ModelViewSet):
    queryset = YoutubeVideo.objects.all()
    serializer_class = YoutubeVideoSerializer
    permission_classes = [AdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    search_fields = ["title", "video_id", "youtube_url"]
    ordering_fields = ["updated_at"]
