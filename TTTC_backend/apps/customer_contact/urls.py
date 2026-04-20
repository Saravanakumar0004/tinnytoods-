from rest_framework.routers import DefaultRouter
from .views import ContactViewset,CallCountView, VisitorViewSet


router = DefaultRouter()

router.register(r"contact",ContactViewset, basename="contact" )
router.register(r"callcount",CallCountView,basename="callcount")
router.register(r"visitors",VisitorViewSet,basename="visitors")
urlpatterns = router.urls 