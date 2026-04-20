from rest_framework.routers import DefaultRouter
from .views import BranchViewset

router = DefaultRouter()

router.register(r"branches", BranchViewset, basename='branches')

urlpatterns = router.urls