import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import VideoCard from './VideoCard';
import SkeletonCard from './SkeletonCard';
import api from '@/services/api';

interface VideoRowProps {
  title: string;
  category: string;
}

export default function VideoRow({ title, category }: VideoRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/movies/?category=${category}`);
        setMovies(response.data.results || []);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [category]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth 
        : scrollLeft + clientWidth;
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!loading && movies.length === 0) return null;

  return (
    <div className="space-y-2 mb-10 md:mb-14 relative group z-10">
      <h2 className="text-xl md:text-3xl font-bold text-white px-6 md:px-12 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] tracking-wide">
        {title}
      </h2>
      
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black via-black/80 to-transparent z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <ChevronLeft 
          className="absolute left-2 top-0 bottom-0 z-40 m-auto h-full w-10 md:w-14 cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-125 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          onClick={() => handleScroll('left')}
        />
        
        <div 
          ref={rowRef}
          className="flex items-center space-x-4 overflow-x-scroll no-scrollbar px-6 md:px-12 pb-8 pt-4 snap-x snap-mandatory scroll-smooth"
        >
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            : movies.map((movie) => (
                <VideoCard key={movie.id} video={movie} />
              ))}
        </div>
        
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black via-black/80 to-transparent z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <ChevronRight 
          className="absolute right-2 top-0 bottom-0 z-40 m-auto h-full w-10 md:w-14 cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-125 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          onClick={() => handleScroll('right')}
        />
      </div>
    </div>
  );
}
