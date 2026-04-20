from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from rest_framework_simplejwt.tokens import RefreshToken
from apps.accounts.permission import IsAdminStaff, AdminOrReadOnly, AdminOrCreateOnly
from .serializers import AdminLoginSerializer, ChangePasswordSerializer, LogoutSerializer, UserProfileSerializer, UserProfileUpdateSerializer

class AdminLoginview(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = "admin_login"

    def get(self, request):
        return Response(
            {
                "message":"use Post with Email and password to login"
            },
            status = 200
        )

    def post(self, request):
        serializer = AdminLoginSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user) 

        return Response(
            {
                "message":"Login successful",
                "access":str(refresh.access_token),
                "refresh": str(refresh),
                "user":{"email":user.email, "full_name":user.full_name}
            },
            status = status.HTTP_200_OK
        )    
    
class AdminChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # only admins can change via this endpoint
        if not request.user.is_staff:
            return Response({"detail": "Admin only."}, status=status.HTTP_403_FORBIDDEN)

        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save()

        return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Logged out successfully"}, status=status.HTTP_204_NO_CONTENT)
    


class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserProfileSerializer(request.user).data)

    def patch(self, request):
        serializer = UserProfileUpdateSerializer(
            request.user, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Profile updated", "user": UserProfileSerializer(request.user).data},
                        status=status.HTTP_200_OK)