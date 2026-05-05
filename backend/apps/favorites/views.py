from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Favorite
from apps.videos.models import Video
from .serializers import FavoriteSerializer

class FavoriteListCreateView(APIView):
    def get(self, request):
        favorites = Favorite.objects.all().order_by('-created_at')
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data)

    def post(self, request):
        video_data = request.data.get('video', {})
        tmdb_id = video_data.get('tmdb_id')
        if not tmdb_id:
            return Response({'error': 'Video tmdb_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
        video, _ = Video.objects.get_or_create(
            tmdb_id=tmdb_id,
            defaults={
                'title': video_data.get('title', ''),
                'poster_url': video_data.get('poster_url', ''),
                'category': video_data.get('category', 'movie')
            }
        )
        
        if Favorite.objects.filter(video=video).exists():
            return Response({'error': 'Already favorited'}, status=status.HTTP_400_BAD_REQUEST)
            
        favorite = Favorite.objects.create(video=video)
        serializer = FavoriteSerializer(favorite)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class FavoriteDestroyView(APIView):
    def delete(self, request, pk):
        try:
            # pk is tmdb_id
            video = Video.objects.get(tmdb_id=pk)
            favorite = Favorite.objects.get(video=video)
            favorite.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except (Video.DoesNotExist, Favorite.DoesNotExist):
            return Response({'error': 'Favorite not found'}, status=status.HTTP_404_NOT_FOUND)
