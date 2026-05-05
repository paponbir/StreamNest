from django.db import models

class Video(models.Model):
    tmdb_id = models.IntegerField(unique=True)
    title = models.CharField(max_length=255)
    poster_url = models.URLField(max_length=500, null=True, blank=True)
    category = models.CharField(max_length=100, default='movie')
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class WatchHistory(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='history')
    season_number = models.IntegerField(null=True, blank=True)
    episode_number = models.IntegerField(null=True, blank=True)
    last_watched = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"History: {self.video.title}"

class Rating(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='ratings')
    score = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Rating: {self.video.title} - {self.score}"
