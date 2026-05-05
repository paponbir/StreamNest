import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Heart, Plus, ListVideo, Star } from 'lucide-react';
import api, { tmdbImage } from '@/services/api';

export default function Watch() {
  const router = useRouter();
  const { id, type } = router.query;
  
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  
  // TV Show State
  const [seasons, setSeasons] = useState<any[]>([]);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [fetchingEpisodes, setFetchingEpisodes] = useState(false);

  const [anilistId, setAnilistId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchMovieDetails();
    }
  }, [id, type]);

  useEffect(() => {
    if ((type === 'tv' || type === 'anime') && movie && seasons.length > 0) {
      fetchEpisodes(selectedSeason);
    }
  }, [selectedSeason, movie, seasons]);

  useEffect(() => {
    if (movie) {
      updateWatchHistory();
    }
  }, [selectedSeason, selectedEpisode, movie]);

  const fetchMovieDetails = async () => {
    try {
      let data;
      if (type === 'anime') {
        const { getAnimeDetails } = await import('@/services/animeApi');
        data = await getAnimeDetails(id as string);
        setMovie(data);
        
        // Map MAL ID to Anilist ID for the video player
        try {
          const aniRes = await fetch('https://graphql.anilist.co/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: 'query($idMal: Int) { Media(idMal: $idMal, type: ANIME) { id } }',
              variables: { idMal: parseInt(id as string) }
            })
          });
          const aniData = await aniRes.json();
          if (aniData?.data?.Media?.id) {
            setAnilistId(aniData.data.Media.id.toString());
          }
        } catch (e) { console.error("Anilist mapping failed", e); }
        
        // Attempt to find TMDB ID by searching title
        try {
          const searchRes = await api.get(`/movies/?query=${encodeURIComponent(data.title)}`);
          const results = searchRes.data.results || searchRes.data;
          const match = results.find((r: any) => r.media_type === 'tv' || r.category === 'tv' || r.title === data.title || r.name === data.title);
          const foundTmdbId = match ? match.id : (results.length > 0 ? results[0].id : null);
          if (foundTmdbId) {
             // Fetch TV details to get season boundaries and episodes
             try {
                const tvRes = await api.get(`/movies/${foundTmdbId}/?media_type=tv`);
                // Override the movie data with TMDB data so episodes and seasons work natively
                setMovie({
                  ...tvRes.data,
                  original_mal_id: id // keep original just in case
                });
                data = tvRes.data; // Update local data reference
             } catch (e) { console.error("Failed to fetch TMDB seasons for anime", e); }
          }
        } catch (e) { console.error("TMDB mapping failed", e); }
        
      } else {
        const response = await api.get(`/movies/${id}/?media_type=${type || 'movie'}`);
        data = response.data;
        setMovie(data);
      }
      
      let initialSeason = 1;
      let initialEpisode = 1;

      // Check Watch History
      try {
        const historyRes = await api.get('/history/');
        const pastWatch = historyRes.data.find((h: any) => h.video.tmdb_id === parseInt(id as string));
        if (pastWatch) {
          initialSeason = pastWatch.season_number || 1;
          initialEpisode = pastWatch.episode_number || 1;
        }
      } catch (e) {
        console.error('Failed to check history', e);
      }
      
      if ((type === 'tv' || type === 'anime') && data.seasons) {
        // Filter out "Specials" (season 0) if desired, or keep them
        const validSeasons = data.seasons.filter((s: any) => s.season_number > 0);
        setSeasons(validSeasons);
        setSelectedSeason(initialSeason);
        setSelectedEpisode(initialEpisode);
      }
      
      // Check Favorites
      try {
        const favs = await api.get('/favorites/');
        const isFav = favs.data.some((f: any) => f.video.tmdb_id === parseInt(id as string));
        setIsFavorite(isFav);
      } catch (e) { }

      // Check User Rating
      try {
        const ratings = await api.get('/ratings/');
        const rating = ratings.data.find((r: any) => r.video.tmdb_id === parseInt(id as string));
        if (rating) {
          setUserRating(rating.score);
        }
      } catch (e) { }

    } catch (error) {
      console.error('Failed to fetch details', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEpisodes = async (seasonNumber: number) => {
    setFetchingEpisodes(true);
    try {
      // Use movie?.id to ensure we use the TMDB ID, even for Anime
      const res = await api.get(`/tv/${movie?.id || id}/season/${seasonNumber}/`);
      setEpisodes(res.data.episodes || []);
    } catch (err) {
      console.error("Failed to fetch episodes", err);
    } finally {
      setFetchingEpisodes(false);
    }
  };

  const updateWatchHistory = async () => {
    try {
      await api.post('/history/', {
        video: {
          tmdb_id: movie.id,
          title: movie.title || movie.name,
          poster_url: movie.poster_path,
          category: type || 'movie'
        },
        season_number: type === 'tv' ? selectedSeason : null,
        episode_number: type === 'tv' ? selectedEpisode : null
      });
    } catch (e) {
      console.error("Failed to update watch history", e);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}/`);
        setIsFavorite(false);
      } else {
        await api.post('/favorites/', {
          video: {
            tmdb_id: movie.id,
            title: movie.title || movie.name,
            poster_url: movie.poster_path,
            category: type || 'movie'
          }
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Failed to toggle favorite', error);
    }
  };

  const handleRate = async (score: number) => {
    try {
      await api.post('/ratings/', {
        video: {
          tmdb_id: movie.id,
          title: movie.title || movie.name,
          poster_url: movie.poster_path,
          category: type || 'movie'
        },
        score
      });
      setUserRating(score);
    } catch (error) {
      console.error('Failed to submit rating', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 px-6 md:px-10 lg:px-14">
        <div className="grid gap-12 lg:grid-cols-[3fr_1fr]">
          <div className="space-y-6">
            <div className="h-[50vh] rounded-[2rem] bg-slate-900 overflow-hidden relative">
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" />
            </div>
            <div className="flex gap-4">
              <div className="h-12 w-40 rounded-xl bg-slate-800 animate-pulse" />
              <div className="h-12 w-28 rounded-xl bg-slate-800 animate-pulse" />
            </div>
          </div>

          <div className="space-y-5">
            <div className="h-10 w-3/4 rounded-xl bg-slate-800 animate-pulse" />
            <div className="h-6 w-1/3 rounded-xl bg-slate-800 animate-pulse" />
            <div className="h-12 rounded-2xl bg-slate-800 animate-pulse" />
            <div className="space-y-4">
              <div className="h-4 w-full rounded-full bg-slate-800 animate-pulse" />
              <div className="h-4 w-5/6 rounded-full bg-slate-800 animate-pulse" />
              <div className="h-4 w-4/6 rounded-full bg-slate-800 animate-pulse" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-16 rounded-2xl bg-slate-800 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Video not found.</div>;
  }

  const buildPlayerUrl = (baseUrl: string, params: Record<string, string>) => {
    const searchParams = new URLSearchParams(params);
    return `${baseUrl}?${searchParams.toString()}`;
  };

  // Determine iframe source
  let iframeSrc = '';
  const vidlinkParams = {
    player: 'jw',
    title: 'false',
    autoplay: 'false',
    nextbutton: 'false',
    primaryColor: 'e50914',
    secondaryColor: '000000',
    iconColor: 'ffffff',
  };

  if (type === 'anime') {
    if (movie.original_mal_id) {
      // Successfully mapped to TMDB, treat perfectly as TV show!
      iframeSrc = buildPlayerUrl(`https://vidlink.pro/tv/${movie.id}/${selectedSeason}/${selectedEpisode}`, vidlinkParams);
    } else if (anilistId) {
      // Fallback to autoembed if VidLink mapping isn't available
      iframeSrc = `https://autoembed.to/anime/anilist/${anilistId}?ep=${selectedEpisode}`;
    } else {
      iframeSrc = `https://autoembed.to/anime/mal/${id}?ep=${selectedEpisode}`;
    }
  } else if (type === 'tv') {
    iframeSrc = buildPlayerUrl(`https://vidlink.pro/tv/${id}/${selectedSeason}/${selectedEpisode}`, vidlinkParams);
  } else {
    iframeSrc = buildPlayerUrl(`https://vidlink.pro/movie/${id}`, vidlinkParams);
  }

  return (
    <div className="min-h-screen bg-black pt-20 flex flex-col lg:flex-row">
      <Head>
        <title>{movie.title || movie.name} - StreamNest</title>
      </Head>

      {/* Main Video Player */}
      <div className="flex-grow lg:w-3/4 h-[40vh] md:h-[60vh] lg:h-[calc(100vh-5rem)] bg-black relative shadow-2xl">
        <iframe 
          src={iframeSrc} 
          className="video-player w-full h-full absolute inset-0 border-0"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          referrerPolicy="origin"
        ></iframe>
      </div>

      {/* Sidebar Info */}
      <div className="lg:w-1/4 p-6 overflow-y-auto h-auto lg:h-[calc(100vh-5rem)] bg-transparent border-l border-white/10 no-scrollbar relative">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-wide drop-shadow-md">{movie.title || movie.name}</h1>
        
        <div className="flex items-center gap-4 text-gray-300 text-sm mb-6 font-medium">
          <span>{movie.release_date ? movie.release_date.split('-')[0] : movie.first_air_date?.split('-')[0]}</span>
          {movie.vote_average > 0 && (
            <span className="text-green-400 font-bold">{Math.round(movie.vote_average * 10)}% Match</span>
          )}
        </div>

        <button 
          onClick={toggleFavorite}
          className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 mb-6 transition-all duration-300 shadow-lg
            ${isFavorite ? 'bg-red-600/20 text-red-500 border border-red-500 hover:bg-red-600/30' : 'bg-white text-black hover:bg-gray-200 hover:scale-[1.02]'}`}
        >
          {isFavorite ? (
            <>
              <Heart fill="currentColor" size={20} /> In My List
            </>
          ) : (
            <>
              <Plus size={20} /> Add to My List
            </>
          )}
        </button>

        <div className="mb-8">
          <p className="text-gray-400 text-sm font-semibold mb-2">Rate this title:</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                className={`transition-all duration-200 hover:scale-125 focus:outline-none ${userRating && userRating >= star ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400/50'}`}
              >
                <Star size={18} fill={userRating && userRating >= star ? 'currentColor' : 'none'} />
              </button>
            ))}
            {userRating && <span className="ml-2 text-yellow-400 font-bold text-sm">{userRating}/10</span>}
          </div>
        </div>

        <p className="text-gray-300 text-sm md:text-sm leading-relaxed mb-8 opacity-90">
          {movie.overview}
        </p>

        {/* TV Show Seasons & Episodes */}
        {(type === 'tv' || type === 'anime') && (seasons.length > 0 || episodes.length > 0) && (
          <div className="mt-6 border-t border-white/10 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2"><ListVideo size={20} /> Episodes</h2>
              {(type === 'tv' || type === 'anime') && seasons.length > 0 && (
                <select 
                  className="bg-black/50 text-white border border-gray-600 text-sm rounded-md focus:ring-red-500 focus:border-red-500 block p-2 backdrop-blur-md outline-none"
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(Number(e.target.value))}
              >
                  {seasons.map((s) => (
                    <option key={s.id} value={s.season_number}>
                      Season {s.season_number}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-3">
              {fetchingEpisodes ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse flex space-x-4 w-full">
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-600 rounded"></div>
                      <div className="h-4 bg-gray-600 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ) : (
                episodes.map((ep) => (
                  <div 
                    key={ep.id} 
                    onClick={() => setSelectedEpisode(ep.episode_number)}
                    className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group
                      ${selectedEpisode === ep.episode_number 
                        ? 'bg-white/20 shadow-inner border border-white/20' 
                        : 'hover:bg-white/10'}`}
                  >
                    <div className="relative min-w-[120px] w-[120px] h-[68px] rounded-md overflow-hidden bg-gray-800">
                      {ep.still_path ? (
                        <img 
                          src={tmdbImage(ep.still_path, 'w300')} 
                          alt={ep.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Image</div>
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div className="flex flex-col justify-center overflow-hidden">
                      <h4 className={`text-sm font-semibold truncate ${selectedEpisode === ep.episode_number ? 'text-white' : 'text-gray-200'}`}>
                        {ep.episode_number}. {ep.name}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">{ep.runtime ? `${ep.runtime}m` : ''}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
