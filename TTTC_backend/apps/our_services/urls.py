from rest_framework.routers import DefaultRouter
from .views import OurServicesViewset, AutismViewset

router = DefaultRouter()

router.register(r"services", OurServicesViewset, basename="services")
router.register(r"autism", AutismViewset, basename="autism")

urlpatterns = router.urls