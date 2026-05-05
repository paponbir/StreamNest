import { useEffect, useState } from 'react';
import Head from 'next/head';
import VideoCard from '@/components/VideoCard';
import api from '@/services/api';

export default function MyRatings() {
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const response = await api.get('/ratings/');
      // Map django response to look like TMDB object for VideoCard
      const mapped = response.data.map((rate: any) => ({
        id: rate.video.tmdb_id,
        poster_path: rate.video.poster_url ? rate.video.poster_url.replace('https://image.tmdb.org/t/p/w500', '') : null,
        title: rate.video.title,
        media_type: rate.video.category,
        userRating: rate.score
      }));
      setRatings(mapped);
    } catch (error) {
      console.error('Failed to fetch ratings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRating = async (id: number) => {
    // In the future, we could add a DELETE endpoint for ratings. 
    // Since the backend doesn't have it explicitly mapped right now or it wasn't requested to remove ratings, 
    // we'll just keep the function ready or exclude onRemove from my-ratings if not needed.
    // The user requested to remove from my list, not from my ratings.
  };

  return (
    <div className="min-h-screen pt-24 px-6 md:px-12">
      <Head>
        <title>My Ratings - StreamNest</title>
      </Head>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Ratings</h1>
        <p className="text-gray-400 text-lg">
          You have rated <span className="text-yellow-400 font-bold">{ratings.length}</span> {ratings.length === 1 ? 'title' : 'titles'}.
        </p>
      </div>

      {loading ? (
        <div className="text-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e50914] mx-auto"></div>
        </div>
      ) : ratings.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {ratings.map((item) => (
            <VideoCard key={item.id} video={item} userRating={item.userRating} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-lg">You haven't rated anything yet.</p>
      )}
    </div>
  );
}
