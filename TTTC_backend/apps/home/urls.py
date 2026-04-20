from rest_framework.routers import DefaultRouter
from .views import HomeStatsViewSet
router = DefaultRouter()

router.register(r"homestats", HomeStatsViewSet, basename="homestats")

urlpatterns = router.urls