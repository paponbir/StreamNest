from django.db import models
from apps.videos.models import Video

class Favorite(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='favorites')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Favorite: {self.video.title}"
