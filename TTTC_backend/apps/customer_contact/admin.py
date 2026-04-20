from django.contrib import admin
from .models import CustomerContact,CallCount
# Register your models here.

admin.site.register(CustomerContact)
admin.site.register(CallCount)
