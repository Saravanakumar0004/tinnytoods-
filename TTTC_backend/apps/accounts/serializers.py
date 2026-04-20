from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from rest_framework_simplejwt.exceptions import TokenError

class AdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(email=email, password=password)

        if not user:
            raise serializers.ValidationError({"details":"Invalid Email or password."})
        
        if not user.is_active:
            raise serializers.ValidationError({"details":"Account is diabled."})
        
        if not user.is_staff:
            raise serializers.ValidationError({"details":"Not allowed. Admin only."})

        attrs["user"] =user     
        return attrs

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "password", "full_name", "is_staff", "is_active", "created_at"]
        read_only_fields = ["email", "is_staff", "is_active", "created_at"]

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["full_name"]

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, min_length=6)
    new_password = serializers.CharField(write_only=True, min_length=6)

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value

    def validate(self, attrs):
        if attrs["old_password"] == attrs["new_password"]:
            raise serializers.ValidationError({"new_password": "New password must be different."})
        return attrs
    
class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        refresh = attrs.get("refresh")

        try:
            self.token = RefreshToken(refresh)
        except TokenError:
            raise serializers.ValidationError("Invalid or expired token")

        return attrs

    def save(self, **kwargs):
        try:
            self.token.blacklist()
        except TokenError:
            raise serializers.ValidationError("Token already blacklisted")
    
