import base64
import uuid
from django.core.files.base import ContentFile
from rest_framework import serializers
from .models import Category, Photo


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "created_at", "updated_at"]


class PhotoSerializer(serializers.ModelSerializer):
    # frontend sends base64 in "image"
    image = serializers.CharField(write_only=True)
    image_url = serializers.ImageField(source="image", read_only=True)

    category_id = serializers.PrimaryKeyRelatedField(
        source="category",
        queryset=Category.objects.all(),
        write_only=True
    )
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Photo
        fields = [
            "id",
            "category",
            "category_id",
            "title",
            "description",
            "image",
            "image_url",
            "created_at",
            "updated_at",
        ]

    def validate_image(self, value: str):
        if ";base64," not in value:
            raise serializers.ValidationError("Image must be base64 data URL like: data:image/png;base64,...")
        header, _ = value.split(";base64,", 1)
        if not header.startswith("data:image/"):
            raise serializers.ValidationError("Only image base64 is allowed.")
        return value

    def create(self, validated_data):
        image_data = validated_data.pop("image")

        header, imgstr = image_data.split(";base64,", 1)
        ext = header.split("/")[-1]
        if ext == "jpeg":
            ext = "jpg"

        filename = f"{uuid.uuid4()}.{ext}"
        file = ContentFile(base64.b64decode(imgstr), name=filename)

        return Photo.objects.create(image=file, **validated_data)
