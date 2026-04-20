from rest_framework.serializers import ModelSerializer
from .models import OurServices, AutismCount


class OurServiceSerializer(ModelSerializer):
    class Meta:
        model = OurServices

        fields = [
            "id",
            "title",
            "description",
            "icon",
            "created_at",
            "updated_at",
        ]

        read_only_fields = ["id","created_at", "updated_at"]


class AutismSerializer(ModelSerializer):
    class Meta:
        model = AutismCount

        fields = [
            "id",
            "autism_then",
            "autism_now",
            "created_at",
            "updated_at",
        ]

        read_only_fields = ["id","created_at", "updated_at"]


        
