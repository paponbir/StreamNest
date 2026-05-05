"""
URL configuration for StreamNest project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from apps.videos.views import MovieListView, MovieDetailView, TVSeasonView, WatchHistoryView, RatingView
from apps.favorites.views import FavoriteListCreateView, FavoriteDestroyView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/movies/', MovieListView.as_view(), name='movie-list'),
    path('api/movies/<int:pk>/', MovieDetailView.as_view(), name='movie-detail'),
    path('api/tv/<int:pk>/season/<int:season_number>/', TVSeasonView.as_view(), name='tv-season-detail'),
    path('api/history/', WatchHistoryView.as_view(), name='watch-history'),
    path('api/favorites/', FavoriteListCreateView.as_view(), name='favorite-list-create'),
    path('api/favorites/<int:pk>/', FavoriteDestroyView.as_view(), name='favorite-destroy'),
    path('api/ratings/', RatingView.as_view(), name='rating-list-create'),
]
