import Head from 'next/head';
import { Play, Sparkles } from 'lucide-react';
import VideoRow from '@/components/VideoRow';
import HistoryRow from '@/components/HistoryRow';
import api, { tmdbImage } from '@/services/api';

export async function getServerSideProps() {
  let heroMovie = null;
  try {
    const res = await api.get('/movies/?category=trending');
    const results = res.data.results;
    if (results && results.length > 0) {
      heroMovie = results[Math.floor(Math.random() * results.length)];
    }
  } catch (error) {
    console.error('Error fetching hero movie', error);
  }

  return {
    props: {
      heroMovie,
    },
  };
}

export default function Home({ heroMovie }: { heroMovie: any }) {
  return (
    <main className="min-h-screen pb-10 bg-[#0a0a0a]">
      <Head>
        <title>StreamNest - Home</title>
        <meta name="description" content="Personal Netflix-style streaming app" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      {/* Hero Banner */}
      <div className="relative h-[80vh] w-full group overflow-hidden">
        {heroMovie && (
          <>
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img
                src={tmdbImage(heroMovie.backdrop_path || heroMovie.poster_path, 'original')}
                alt={heroMovie.title || heroMovie.name}
                className="w-full h-full object-cover transform transition-transform duration-[20s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/85 to-transparent" />
              <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/90 to-transparent" />
            </div>

            <div className="absolute top-8 left-6 md:left-12 z-20 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm shadow-lg shadow-black/30">
              <Sparkles size={18} className="text-[#e50914]" />
              Premium Experience
            </div>
            <div className="absolute top-20 left-6 md:left-12 z-20 rounded-full bg-black/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-gray-200 border border-white/10 backdrop-blur-sm shadow-sm shadow-black/40">
              Built by Paponbir
            </div>

            <div className="absolute bottom-[22%] left-6 md:left-12 max-w-2xl z-20">
              <p className="uppercase tracking-[0.32em] text-xs md:text-sm text-red-500 font-semibold mb-3">Premium Picks</p>
              <h1 className="text-4xl md:text-7xl font-extrabold mb-4 tracking-tight text-white leading-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.8)]">
                {heroMovie.title || heroMovie.name}
              </h1>
              <p className="text-sm md:text-lg text-gray-300 line-clamp-3 mb-8 drop-shadow-lg font-medium max-w-xl">
                {heroMovie.overview || 'Experience handpicked movies and shows in a sleek, cinematic interface.'}
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <a
                  href={`/watch/${heroMovie.id}?type=${heroMovie.media_type || 'movie'}`}
                  className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 md:py-4 rounded-full font-semibold text-base hover:bg-gray-100 transition-all duration-300 shadow-[0_20px_50px_rgba(255,255,255,0.12)]"
                >
                  <Play fill="currentColor" size={22} /> Play Now
                </a>
                <a
                  href="#browse"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-3 md:py-4 text-white text-base hover:bg-white/10 transition-all duration-300"
                >
                  Explore
                </a>
              </div>
            </div>

            <div className="absolute bottom-8 left-6 md:left-12 right-6 md:right-auto z-20 flex flex-wrap gap-3 text-xs text-gray-200">
              <span className="rounded-full bg-white/10 px-3 py-1 border border-white/10">{heroMovie.release_date?.split('-')[0] || heroMovie.first_air_date?.split('-')[0] || 'New'}</span>
              <span className="rounded-full bg-white/10 px-3 py-1 border border-white/10">{heroMovie.vote_average ? `${Math.round(heroMovie.vote_average * 10)}% Match` : 'Top Rated'}</span>
              <span className="rounded-full bg-white/10 px-3 py-1 border border-white/10">{heroMovie.media_type ? heroMovie.media_type.toUpperCase() : 'MOVIE'}</span>
            </div>
          </>
        )}

        {!heroMovie && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white text-center px-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-red-500 mb-4">Premium Experience</p>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Your next favorite stream starts here.</h2>
              <p className="max-w-2xl mx-auto text-gray-300">Browse curated movies, series, and anime in a clean, cinematic interface with fast loading and premium visuals.</p>
            </div>
          </div>
        )}
      </div>

      <div className="-mt-8 relative z-30 space-y-6" id="browse">
        <HistoryRow />
        <VideoRow title="Trending Now" category="trending" />
        <VideoRow title="Popular Series" category="popular_series" />
        <VideoRow title="Popular Anime" category="anime" />
        <VideoRow title="Blockbuster Movies" category="popular" />
      </div>

      <footer className="relative z-30 px-6 md:px-12 pb-16 pt-12">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-black/60 p-10 backdrop-blur-2xl shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-red-400 mb-3">Built by Paponbir</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">Stay connected with the creator for more premium builds.</h2>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-sm text-gray-400 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p>StreamNest © {new Date().getFullYear()} — Crafted by Paponbir.</p>
            <div className="flex flex-wrap gap-4 text-gray-300">
              <a href="https://paponbir.netlify.app/" target="_blank" rel="noreferrer" className="hover:text-white transition">Creator Portfolio</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
