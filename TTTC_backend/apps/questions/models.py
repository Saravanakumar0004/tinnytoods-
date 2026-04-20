from django.db import models

class Questions(models.Model):
    question = models.CharField(max_length=300)
    description = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "questions"

    def __str__(self):
        return f"Questions #{self.id}"