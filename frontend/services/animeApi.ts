import axios from 'axios';

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

const animeApi = axios.create({
  baseURL: JIKAN_BASE_URL,
});

// Helper to map Jikan Anime object to look like our TMDB Video object for the VideoCard
export const mapJikanToVideo = (anime: any) => {
  return {
    id: anime.mal_id,
    poster_path: anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url,
    title: anime.title_english || anime.title,
    media_type: 'anime', // Custom type to differentiate from TMDB 'tv' or 'movie'
    vote_average: anime.score,
    release_date: anime.aired?.from ? anime.aired.from.split('-')[0] : null,
    overview: anime.synopsis,
  };
};

export const getTopAnime = async () => {
  const response = await animeApi.get('/top/anime?filter=bypopularity');
  return response.data.data.map(mapJikanToVideo);
};

export const getAiringAnime = async () => {
  const response = await animeApi.get('/seasons/now');
  return response.data.data.map(mapJikanToVideo);
};

export const getUpcomingAnime = async () => {
  const response = await animeApi.get('/seasons/upcoming');
  return response.data.data.map(mapJikanToVideo);
};

export const getAnimeDetails = async (id: number | string) => {
  const response = await animeApi.get(`/anime/${id}/full`);
  return mapJikanToVideo(response.data.data);
};

export default animeApi;
