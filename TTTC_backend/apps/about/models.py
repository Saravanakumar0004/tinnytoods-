from django.db import models
from django.core.validators import MinValueValidator

class About(models.Model):
    success_rate =models.PositiveIntegerField(validators=[MinValueValidator(0)]) 
    parent_satisfaction =models.PositiveIntegerField(validators=[MinValueValidator(0)]) 
    improvement_rate =models.PositiveIntegerField(validators=[MinValueValidator(0)]) 
    early_detection =models.PositiveIntegerField(validators=[MinValueValidator(0)])

    phone_no_one = models.CharField(max_length=20)
    phone_no_two = models.CharField(max_length=20)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "about"

    def __str__(self):
        return f"About #{self.id}"
