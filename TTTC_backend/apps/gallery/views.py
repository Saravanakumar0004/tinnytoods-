from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Category, Photo
from apps.accounts.permission import AdminOrReadOnly
from .serializer import CategorySerializer, PhotoSerializer
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser



class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AdminOrReadOnly]  # change if needed

    lookup_field = "slug"

    @action(detail=True, methods=["get"], url_path="photos")
    def photos(self, request, slug=None):
        category = self.get_object()
        qs = category.photos.all().order_by("-created_at")  # related_name="photos"
        return Response(PhotoSerializer(qs, many=True).data)

class PhotoViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.select_related("category").all()
    serializer_class = PhotoSerializer
    permission_classes = [AdminOrReadOnly]  # change if needed
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "description", "category__name", "category__slug"]
    ordering_fields = ["created_at"]

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get("category")  # slug
        if category:
            qs = qs.filter(category__slug=category)
        return qs
