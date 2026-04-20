from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, PhotoViewSet

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="categories")
router.register("photos", PhotoViewSet, basename="photos")

urlpatterns = router.urls
