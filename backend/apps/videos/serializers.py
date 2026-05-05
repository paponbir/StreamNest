from rest_framework import serializers
from .models import Video, WatchHistory, Rating

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'

class WatchHistorySerializer(serializers.ModelSerializer):
    video = VideoSerializer(read_only=True)
    class Meta:
        model = WatchHistory
        fields = '__all__'

class RatingSerializer(serializers.ModelSerializer):
    video = VideoSerializer(read_only=True)
    class Meta:
        model = Rating
        fields = '__all__'
