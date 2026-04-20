from django.db import models

class Branches(models.Model):
    branch_name = models.CharField(max_length = 100)
    phone = models.CharField(max_length = 20)
    location = models.CharField(max_length = 200)
    mapurl =models.URLField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add =True)
    updated_at = models.DateTimeField(auto_now =True)

    class Meta:
        db_table  = "branches"

    def __str__(self):
        return f"Branches #{self.id}"
        
