from django.db import models

class BookConsultation(models.Model):
    date = models.DateField()
    time = models.CharField(max_length=10)
    branch = models.CharField(max_length=50)
    therapy_type = models.CharField(max_length=50)
    parent_name = models.CharField(max_length=50)
    child_name = models.CharField(max_length=50)
    phone = models.CharField(max_length=20)
    email = models.EmailField(max_length=50)
    notes = models.TextField()
    status = models.CharField(max_length=20, default="pending")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 

    class Meta:
        db_table = "book"

    def __str__(self):
        return f"BookConsultation #{self.id}"