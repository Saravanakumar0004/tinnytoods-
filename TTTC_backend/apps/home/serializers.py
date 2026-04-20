from rest_framework import serializers
from .models import HomeStats


class HomeStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeStats

        fields = [
            "id",
            "years_of_experience",
            "happy_students",
            "branches",
            "qualified_teachers",
            "students_enrolled",
            "created_at",
            "updated_at",
        ]   

        read_only_fields= ["id", "created_at", "updated_at"]

def validate(self, attrs):

    y = attrs.get("years_of_exeprience")

    if y is not None and y>100:
        raise serializers.ValidationError({"year of exprience": "Too High. Max 100"})
    
    return attrs