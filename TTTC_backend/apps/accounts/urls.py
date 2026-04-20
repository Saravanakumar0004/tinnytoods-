from django.urls import path
from .views import AdminLoginview, AdminChangePasswordView, LogoutView, UserProfileView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("admin/login/", AdminLoginview.as_view(), name = "admin_login"),
    path("admin/changepassword/", AdminChangePasswordView.as_view(), name = "changepassword"),
    path("admin/refresh/", TokenRefreshView.as_view(), name = "refresh"),
    path("admin/logout/", LogoutView.as_view(), name = "logout"),
    path("admin/profile/", UserProfileView.as_view(), name = "profile"),
]

