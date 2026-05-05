import { useState, useEffect } from 'react';
import Head from 'next/head';
import VideoCard from '@/components/VideoCard';
import SkeletonCard from '@/components/SkeletonCard';
import api from '@/services/api';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        searchMovies(query);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const searchMovies = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/movies/?query=${encodeURIComponent(searchQuery)}`);
      setResults(response.data.results || []);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6 md:px-12">
      <Head>
        <title>Search - StreamNest</title>
      </Head>
      
      <div className="max-w-3xl mx-auto mb-10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies or TV shows..."
          className="w-full bg-gray-800 text-white border border-gray-700 rounded-md py-4 px-6 text-lg focus:outline-none focus:ring-2 focus:ring-[#e50914] transition"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <SkeletonCard key={index} className="h-[220px] md:h-[280px]" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map((item) => (
            <VideoCard key={item.id} video={item} />
          ))}
        </div>
      ) : query.trim() ? (
        <p className="text-center text-gray-400 mt-20 text-lg">No results found for "{query}"</p>
      ) : null}
    </div>
  );
}
