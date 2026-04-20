from rest_framework.routers import DefaultRouter
from .views import AboutViewset

router = DefaultRouter()
router.register(r"about", AboutViewset, basename='about')
urlpatterns = router.urls