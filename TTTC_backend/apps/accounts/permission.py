from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminStaff(BasePermission):
    message = "Admin only"

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


class AdminOrReadOnly(BasePermission):
    """
    Public can read (GET/HEAD/OPTIONS), only admin can write.
    """
    message = "Admin only"

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


class AdminOrCreateOnly(BasePermission):
    """
    Public can submit (POST) like contact/booking forms.
    Admin can do everything.
    """
    message = "Admin only"

    def has_permission(self, request, view):
        if request.method == "POST":
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)