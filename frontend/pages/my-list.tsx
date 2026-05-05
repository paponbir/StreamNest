import { useEffect, useState } from 'react';
import Head from 'next/head';
import VideoCard from '@/components/VideoCard';
import api from '@/services/api';

export default function MyList() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/favorites/');
      // Map django response to look like TMDB object for VideoCard
      const mapped = response.data.map((fav: any) => ({
        id: fav.video.tmdb_id,
        poster_path: fav.video.poster_url ? fav.video.poster_url.replace('https://image.tmdb.org/t/p/w500', '') : null, // Extract path
        title: fav.video.title,
        media_type: fav.video.category
      }));
      setFavorites(mapped);
    } catch (error) {
      console.error('Failed to fetch favorites', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await api.delete(`/favorites/${id}/`);
      setFavorites(favorites.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to remove favorite', error);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6 md:px-12">
      <Head>
        <title>My List - StreamNest</title>
      </Head>
      
      <h1 className="text-3xl font-bold mb-8">My List</h1>

      {loading ? (
        <div className="text-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e50914] mx-auto"></div>
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {favorites.map((item) => (
            <VideoCard key={item.id} video={item} onRemove={handleRemove} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-lg">You haven't added anything to your list yet.</p>
      )}
    </div>
  );
}
