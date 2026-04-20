from rest_framework import serializers
from .models import CustomerContact,CallCount,SiteCounter

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerContact

        fields = [
            "id",
            "name",
            "email",
            "phone",
            "message",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

class CallCountSerializer(serializers.ModelSerializer):
    class Meta:
        model = CallCount
        fields = ["id", "call_count"]
        read_only_fields = ["id"]    

class VisitorSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteCounter

        fields = [
            "id",
            "total_visits",
            "updated_at",
        ]

        read_only_fields = ["id", "total_visits", "updated_at"]        