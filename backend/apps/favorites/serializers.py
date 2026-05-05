from rest_framework import serializers
from .models import Favorite
from apps.videos.serializers import VideoSerializer

class FavoriteSerializer(serializers.ModelSerializer):
    video = VideoSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = '__all__'
