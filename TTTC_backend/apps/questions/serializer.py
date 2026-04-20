from rest_framework import serializers
from .models import Questions

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questions

        fields = [
            "id",
            "question",
            "description",
            "created_at",
            "updated_at",
        ]

        read_only_fields = ["id", "created_at", "updated_at"]

        