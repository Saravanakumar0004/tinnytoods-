from rest_framework import serializers
from .models import BookConsultation

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookConsultation
        fields = [
            "id",
            "date",
            "time",
            "branch",
            "therapy_type",
            "parent_name",
            "child_name",
            "phone",
            "email",
            "notes",
            "status",
        ]
    read_only_fields = ["id", "created_at", "updated_at"]

