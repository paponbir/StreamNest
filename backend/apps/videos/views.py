import os
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Video, WatchHistory, Rating
from .serializers import VideoSerializer, WatchHistorySerializer, RatingSerializer

TMDB_API_KEY = os.getenv('TMDB_API_KEY')
TMDB_BASE_URL = 'https://api.themoviedb.org/3'

class MovieListView(APIView):
    def get(self, request):
        category = request.query_params.get('category', 'trending')
        search_query = request.query_params.get('query', '')
        
        if search_query:
            url = f"{TMDB_BASE_URL}/search/multi?api_key={TMDB_API_KEY}&query={search_query}"
        elif category == 'trending':
            url = f"{TMDB_BASE_URL}/trending/all/week?api_key={TMDB_API_KEY}"
        elif category == 'popular_series':
            url = f"{TMDB_BASE_URL}/tv/popular?api_key={TMDB_API_KEY}"
        elif category == 'anime':
            url = f"{TMDB_BASE_URL}/discover/tv?api_key={TMDB_API_KEY}&with_genres=16&with_original_language=ja"
        else:
            # e.g., category=movie, popular, etc.
            url = f"{TMDB_BASE_URL}/movie/popular?api_key={TMDB_API_KEY}"
            
        response = requests.get(url)
        if response.status_code == 200:
            return Response(response.json())
        return Response({'error': 'Failed to fetch from TMDB'}, status=response.status_code)

class MovieDetailView(APIView):
    def get(self, request, pk):
        media_type = request.query_params.get('media_type', 'movie')
        url = f"{TMDB_BASE_URL}/{media_type}/{pk}?api_key={TMDB_API_KEY}&append_to_response=videos"
        response = requests.get(url)
        if response.status_code == 200:
            return Response(response.json())
        return Response({'error': 'Failed to fetch from TMDB'}, status=response.status_code)

class TVSeasonView(APIView):
    def get(self, request, pk, season_number):
        url = f"{TMDB_BASE_URL}/tv/{pk}/season/{season_number}?api_key={TMDB_API_KEY}"
        response = requests.get(url)
        if response.status_code == 200:
            return Response(response.json())
        return Response({'error': 'Failed to fetch from TMDB'}, status=response.status_code)

class WatchHistoryView(APIView):
    def get(self, request):
        history = WatchHistory.objects.all().order_by('-last_watched')[:20]
        serializer = WatchHistorySerializer(history, many=True)
        return Response(serializer.data)

    def post(self, request):
        video_data = request.data.get('video')
        if not video_data or not video_data.get('tmdb_id'):
            return Response({'error': 'Video data with tmdb_id is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        video, _ = Video.objects.get_or_create(
            tmdb_id=video_data.get('tmdb_id'),
            defaults={
                'title': video_data.get('title', ''),
                'poster_url': video_data.get('poster_url', ''),
                'category': video_data.get('category', 'movie')
            }
        )
        
        season_number = request.data.get('season_number')
        episode_number = request.data.get('episode_number')
        
        history, created = WatchHistory.objects.update_or_create(
            video=video,
            defaults={
                'season_number': season_number,
                'episode_number': episode_number
            }
        )
        
        if not created:
            history.save()
            
        return Response(WatchHistorySerializer(history).data)

class RatingView(APIView):
    def get(self, request):
        ratings = Rating.objects.all().order_by('-created_at')
        serializer = RatingSerializer(ratings, many=True)
        return Response(serializer.data)

    def post(self, request):
        video_data = request.data.get('video')
        score = request.data.get('score')
        
        if not video_data or not video_data.get('tmdb_id') or score is None:
            return Response({'error': 'Video data with tmdb_id and score are required'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            score = int(score)
            if score < 1 or score > 10:
                return Response({'error': 'Score must be between 1 and 10'}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({'error': 'Score must be an integer'}, status=status.HTTP_400_BAD_REQUEST)
            
        video, _ = Video.objects.get_or_create(
            tmdb_id=video_data.get('tmdb_id'),
            defaults={
                'title': video_data.get('title', ''),
                'poster_url': video_data.get('poster_url', ''),
                'category': video_data.get('category', 'movie')
            }
        )
        
        rating, created = Rating.objects.update_or_create(
            video=video,
            defaults={'score': score}
        )
        
        if not created:
            rating.save()
            
        return Response(RatingSerializer(rating).data)
