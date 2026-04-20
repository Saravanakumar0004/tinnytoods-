from django.db import models

class CustomerContact(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField(max_length=50)
    phone = models.CharField(max_length=20, blank=True)
    message = models.TextField()
    status = models.CharField(max_length=20, default="pending")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "customer_contact"

    def __str__(self):
        return f"CustomerContacts #{self.id}"
    

class CallCount(models.Model):
    call_count = models.IntegerField(default=0)

    def __str__(self):
        return f"Total Calls: {self.call_count}"    
    
class SiteCounter(models.Model):
    key = models.CharField(max_length=50, unique=True, default="main_site")
    total_visits = models.PositiveBigIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "visitors"

    def __str__(self):
        return f"{self.key}: {self.total_visits}"    