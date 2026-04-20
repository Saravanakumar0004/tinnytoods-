from rest_framework import viewsets,status
from .models import CustomerContact,CallCount, SiteCounter
from apps.accounts.permission import AdminOrCreateOnly
from .serializer import ContactSerializer,CallCountSerializer
from rest_framework.response import Response
from django.db.models import F
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny

class ContactViewset(viewsets.ModelViewSet):
    permission_classes = [AdminOrCreateOnly]
    serializer_class = ContactSerializer
    queryset = CustomerContact.objects.all().order_by("-updated_at")


class CallCountView(viewsets.ViewSet):
    permission_classes=[AllowAny]
    def list(self, request):
        obj, created = CallCount.objects.get_or_create(id=1)
        serializer = CallCountSerializer(obj)
        return Response(serializer.data)

    def create(self, request):
        obj, created = CallCount.objects.get_or_create(id=1)
        obj.call_count += 1
        obj.save()
        return Response({"message": "Call count increased"}, status=status.HTTP_200_OK)
    
class VisitorViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=["get", "post"], url_path="count")
    def count(self, request):
        counter, _ = SiteCounter.objects.get_or_create(key="main_site")

        # POST => increment
        if request.method == "POST":
            SiteCounter.objects.filter(pk=counter.pk).update(total_visits=F("total_visits") + 1)
            counter.refresh_from_db()

        return Response({"visitors": counter.total_visits})    