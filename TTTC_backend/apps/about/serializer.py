from rest_framework import serializers
from .models import About

class AboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = About
        fields = [
            "id",
            "success_rate",
            "parent_satisfaction",
            "improvement_rate",
            "early_detection",
            "phone_no_one",
            "phone_no_two",
            "created_at",
            "updated_at",
        ]

        read_only_fields = ["id", "created_at", "updated_at"]

    def validate(self, attrs):
        # validate these 4 fields: must be 0 to 100
        percent_fields = [
            "success_rate",
            "improvement_rate",
            "parent_satisfaction",
            "early_detection",
        ]

        errors = {}
        for field in percent_fields:
            value = attrs.get(field)

            # Skip if not provided (useful for PATCH)
            if value is None:
                continue

            # If value is string coming from frontend, try convert
            try:
                value = float(value)
            except (TypeError, ValueError):
                errors[field] = "Must be a number."
                continue

            if value < 0 or value > 100:
                errors[field] = "Must be between 0 and 100."

        if errors:
            raise serializers.ValidationError(errors)

        return attrs