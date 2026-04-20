from django.db import models

class YoutubeVideo(models.Model):
    youtube_url = models.URLField(unique=True)
    video_id = models.CharField(max_length=32, unique=True)

    title = models.CharField(max_length=300, blank=True)
    thumbnail = models.URLField(blank=True)
    view_count = models.BigIntegerField(null=True, blank=True)  # store number, not "59K views"

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]
        db_table = "youtube"

    def __str__(self):
        return self.title or self.video_id
