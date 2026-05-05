import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import VideoCard from '@/components/VideoCard';
import { getTopAnime, getAiringAnime, getUpcomingAnime } from '@/services/animeApi';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

// Custom AnimeRow to handle the mapped data since we don't use the standard API hook here
function AnimeRow({ title, animes }: { title: string, animes: any[] }) {
  const rowRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth 
        : scrollLeft + clientWidth;
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!animes || animes.length === 0) return null;

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
          className="flex items-center space-x-4 overflow-x-scroll no-scrollbar px-6 md:px-12 pb-8 pt-4"
        >
          {animes.map((anime) => (
            <VideoCard key={anime.id} video={anime} />
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

export default function AnimeHub() {
  const [topAnime, setTopAnime] = useState<any[]>([]);
  const [airingAnime, setAiringAnime] = useState<any[]>([]);
  const [upcomingAnime, setUpcomingAnime] = useState<any[]>([]);
  const [heroAnime, setHeroAnime] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sequentially to avoid rate limits from Jikan API
        const top = await getTopAnime();
        setTopAnime(top);
        
        if (top.length > 0) {
          setHeroAnime(top[Math.floor(Math.random() * Math.min(10, top.length))]);
        }

        await new Promise(r => setTimeout(r, 600));
        
        const airing = await getAiringAnime();
        setAiringAnime(airing);

        await new Promise(r => setTimeout(r, 600));

        const upcoming = await getUpcomingAnime();
        setUpcomingAnime(upcoming);

      } catch (error) {
        console.error("Error fetching anime:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading && !heroAnime) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#e50914]"></div>
      </div>
    );
  }

  // Jikan sometimes returns images in standard format, we don't need TMDB image wrapper.
  // The poster_path is already an absolute URL in the mapper.
  
  return (
    <main className="min-h-screen pb-10 bg-[#0a0a0a]">
      <Head>
        <title>StreamNest - Anime Hub</title>
      </Head>

      {/* Hero Banner */}
      <div className="relative h-[80vh] w-full group overflow-hidden">
        {heroAnime && (
          <>
            <div className="absolute inset-0 w-full h-full">
              {/* Anime posters are usually portrait, so we blur the background and center the image */}
              <div 
                className="absolute inset-0 bg-cover bg-center blur-2xl opacity-50 scale-125"
                style={{ backgroundImage: `url(${heroAnime.poster_path})` }}
              ></div>
              <img
                src={heroAnime.poster_path}
                alt={heroAnime.title}
                className="absolute top-1/2 right-[10%] transform -translate-y-1/2 h-[90%] object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] z-10 transition-transform duration-[10s] hover:scale-105 hidden lg:block"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10" />
              <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10" />
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 to-transparent z-10" />
            </div>
            
            <div className="absolute top-[30%] left-6 md:left-12 max-w-2xl z-20">
              <span className="text-red-500 font-extrabold tracking-[0.2em] uppercase text-sm mb-2 block drop-shadow-md">Top Rated Anime</span>
              <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] tracking-tight text-white leading-tight">
                {heroAnime.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-300 font-bold mb-6">
                <span className="bg-green-600 px-2 py-1 rounded text-white text-xs">Score: {heroAnime.vote_average || 'N/A'}</span>
                <span>{heroAnime.release_date}</span>
              </div>
              <p className="text-base md:text-lg text-gray-300 line-clamp-3 mb-8 drop-shadow-lg font-medium max-w-xl">
                {heroAnime.overview}
              </p>
              <div className="flex gap-4">
                <a 
                  href={`/watch/${heroAnime.id}?type=anime`}
                  className="bg-white text-black px-8 py-3 md:py-4 rounded-md font-bold text-lg hover:bg-gray-200 transition-all duration-300 flex items-center gap-2 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                  <Play fill="currentColor" size={24} /> Watch Now
                </a>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="-mt-16 relative z-30 space-y-6">
        <AnimeRow title="Currently Airing" animes={airingAnime} />
        <AnimeRow title="Top Ranked Anime" animes={topAnime} />
        <AnimeRow title="Upcoming Seasons" animes={upcomingAnime} />
      </div>
    </main>
  );
}
