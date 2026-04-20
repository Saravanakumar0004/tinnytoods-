from rest_framework.throttling import ScopedRateThrottle


class AdminLoginRateThrottle(ScopedRateThrottle):

    scop = "admin_login"

