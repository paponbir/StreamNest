import { useState } from 'react';
import Link from 'next/link';
import { PlayCircle, X, Star } from 'lucide-react';
import { tmdbImage } from '@/services/api';

interface VideoCardProps {
  video: {
    id: number;
    poster_path: string;
    title?: string;
    name?: string;
    media_type?: string;
    vote_average?: number;
    release_date?: string;
    first_air_date?: string;
  };
  onRemove?: (id: number) => void;
  userRating?: number;
}

export default function VideoCard({ video, onRemove, userRating }: VideoCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (!video.poster_path) return null;
  
  const title = video.title || video.name;
  const mediaType = video.media_type || 'movie';
  const year = (video.release_date || video.first_air_date)?.split('-')[0];

  return (
    <Link href={`/watch/${video.id}?type=${mediaType}`} className="snap-start">
      <div className="relative min-w-[160px] md:min-w-[200px] h-[240px] md:h-[300px] cursor-pointer transition-all duration-500 hover:scale-[1.15] hover:z-50 bg-gray-900/80 rounded-lg overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(229,9,20,0.5)] group">
        {onRemove && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              onRemove(video.id);
            }}
            className="absolute top-2 right-2 z-20 bg-black/60 hover:bg-red-600 rounded-full p-1 text-gray-300 hover:text-white transition-colors backdrop-blur-sm"
            title="Remove from list"
          >
            <X size={16} />
          </button>
        )}
        {userRating && (
          <div className="absolute top-2 left-2 z-20 bg-black/60 text-yellow-400 font-bold text-xs px-2 py-1 rounded flex items-center gap-1 backdrop-blur-sm">
            <Star size={12} fill="currentColor" /> {userRating}/10
          </div>
        )}
        <img
          src={tmdbImage(video.poster_path)}
          alt={title}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0 scale-95 blur-sm'}`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <PlayCircle size={32} className="text-white mb-2 drop-shadow-lg" />
            <h3 className="text-white font-bold text-sm md:text-base leading-tight mb-1 drop-shadow-md line-clamp-2">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-xs font-semibold">
              {video.vote_average && video.vote_average > 0 && (
                <span className="text-green-400">{Math.round(video.vote_average * 10)}% Match</span>
              )}
              {year && <span className="text-gray-300">{year}</span>}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
