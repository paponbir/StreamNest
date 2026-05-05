import { useEffect, useState } from 'react';
import { PlayCircle } from 'lucide-react';
import Link from 'next/link';
import api, { tmdbImage } from '@/services/api';
import SkeletonCard from './SkeletonCard';

export default function HistoryRow() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/history/');
        setHistory(response.data || []);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (!loading && history.length === 0) return null;

  return (
    <div className="mb-12 relative z-10">
      <h2 className="text-white text-xl md:text-2xl font-bold mb-4 px-6 md:px-12 drop-shadow-md">
        Continue Watching
      </h2>
      
      {/* Scroll container */}
      <div className="flex overflow-x-auto gap-4 px-6 md:px-12 pb-8 pt-4 no-scrollbar -mt-4">
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard
                key={index}
                className="min-w-[200px] md:min-w-[240px] h-[120px] md:h-[140px]"
              />
            ))
          : history.map((item) => {
              const video = item.video;
              if (!video.poster_url) return null;
              
              const title = video.title;
              const mediaType = video.category || 'movie';
              const progressText = mediaType === 'tv' && item.season_number 
                ? `S${item.season_number} : E${item.episode_number}` 
                : 'Resume Movie';

              return (
                <Link key={item.id} href={`/watch/${video.tmdb_id}?type=${mediaType}`}>
                  <div className="relative min-w-[200px] md:min-w-[240px] h-[120px] md:h-[140px] cursor-pointer transition-all duration-500 hover:scale-110 hover:z-50 bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(229,9,20,0.6)] group">
                    <img
                      src={tmdbImage(video.poster_url.replace('https://image.tmdb.org/t/p/w500', ''))}
                      alt={title}
                      className="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      style={{ objectPosition: 'center 20%' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    
                    {/* Overlay details */}
                    <div className="absolute inset-0 flex flex-col justify-between p-3">
                      <div className="flex justify-between items-start">
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase tracking-wider">
                          {progressText}
                        </span>
                      </div>
                      
                      <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 flex items-center gap-3">
                        <PlayCircle size={28} className="text-white drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <h3 className="text-white font-bold text-sm leading-tight drop-shadow-md line-clamp-2">
                          {title}
                        </h3>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 h-1 bg-gray-600 w-full">
                      <div className="h-full bg-red-600" style={{ width: `${Math.random() * 40 + 30}%` }}></div>
                    </div>
                  </div>
                </Link>
              );
            })}
      </div>
    </div>
  );
}
