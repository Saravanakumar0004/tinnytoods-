from rest_framework import serializers
from .models import Branches

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branches

        fields = [
            "id",
            "branch_name",
            "phone",
            "location",
            "mapurl",
            "latitude",
            "longitude",
            "created_at",
            "updated_at",
        ]

        read_only_fields = ["id", "created_at", "updated_at"]
