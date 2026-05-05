import { useEffect, useState } from 'react';
import Head from 'next/head';
import VideoCard from '@/components/VideoCard';
import api from '@/services/api';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/history/');
      // Map django response to look like TMDB object for VideoCard
      const mapped = response.data.map((item: any) => ({
        id: item.video.tmdb_id,
        poster_path: item.video.poster_url ? item.video.poster_url.replace('https://image.tmdb.org/t/p/w500', '') : null,
        title: item.video.title,
        media_type: item.video.category
      }));
      setHistory(mapped);
    } catch (error) {
      console.error('Failed to fetch history', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-28 px-6 md:px-12">
      <Head>
        <title>Watch History - StreamNest</title>
      </Head>
      
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white drop-shadow-[0_2px_8px_rgba(229,9,20,0.4)] tracking-wide">
          Watch History
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Jump back into your recently watched shows and movies.</p>
      </div>

      {loading ? (
        <div className="flex justify-center mt-32">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#e50914] shadow-[0_0_15px_rgba(229,9,20,0.5)]"></div>
        </div>
      ) : history.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
          {history.map((item, index) => (
            <div 
              key={item.id} 
              className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <VideoCard video={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center opacity-70">
          <div className="w-24 h-24 mb-6 rounded-full bg-gray-800 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Watch History</h2>
          <p className="text-gray-400 text-lg max-w-md">Looks like you haven't started watching anything yet. Head to the homepage to discover great content!</p>
        </div>
      )}
    </div>
  );
}
