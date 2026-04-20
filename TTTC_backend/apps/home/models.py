from django.db import models
from django.core.validators import MinValueValidator

class HomeStats(models.Model):
    years_of_experience =models.PositiveIntegerField(validators=[MinValueValidator(0)]) 
    happy_students =models.PositiveIntegerField(validators=[MinValueValidator(0)]) 
    branches =models.PositiveIntegerField(validators=[MinValueValidator(0)]) 
    qualified_teachers =models.PositiveIntegerField(validators=[MinValueValidator(0)])
    students_enrolled = models.PositiveIntegerField(validators = [MinValueValidator(0)]) 

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "home_stats"

    def __str__(self):
        return f"HomeStats #{self.id}"
    
    