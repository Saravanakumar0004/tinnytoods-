from django.db import models
from django.core.validators import MinValueValidator

class OurServices(models.Model):
    icon = models.CharField(max_length=30)
    title = models.CharField(max_length=150)
    description = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "our_services"
        ordering = ["-created_at"]

        indexes = [
            models.Index(fields = ["created_at"]),
        ]
        
    def __str__(self):
        return f"OurServices #{self.id}"
    
class AutismCount(models.Model):
    autism_then = models.PositiveBigIntegerField(validators=[MinValueValidator(0)])
    autism_now = models.PositiveBigIntegerField(validators=[MinValueValidator(0)])

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "autism"

    def __str__(self):
        return f"AutismCount #{self.id}"