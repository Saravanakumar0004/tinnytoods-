from rest_framework.routers import DefaultRouter
from .views import YoutubeVideoViewSet

router = DefaultRouter()
router.register(r"youtube", YoutubeVideoViewSet, basename="youtube")

urlpatterns = router.urls
