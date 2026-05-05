import Link from 'next/link';
import { Search, Heart } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 flex items-center justify-between p-4 px-6 md:px-12 bg-black/60 backdrop-blur-lg border-b border-white/5 transition-all duration-300">
      <div className="flex items-center gap-8">
        <Link href="/">
          <h1 className="text-3xl font-bold text-[#e50914] cursor-pointer tracking-wider font-sans drop-shadow-[0_0_8px_rgba(229,9,20,0.8)]">
            STREAMNEST
          </h1>
        </Link>
        <div className="hidden md:flex gap-6 text-sm text-gray-300 font-semibold tracking-wide">
          <Link href="/" className="hover:text-white transition-colors duration-300">Home</Link>
          <Link href="/anime" className="hover:text-[#e50914] transition-colors duration-300">Anime</Link>
          <Link href="/my-list" className="hover:text-white transition-colors duration-300">My List</Link>
          <Link href="/my-ratings" className="hover:text-white transition-colors duration-300">My Ratings</Link>
          <Link href="/history" className="hover:text-white transition-colors duration-300">Watch History</Link>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <Link href="/search" className="text-gray-300 hover:text-white hover:scale-110 transition-all duration-300">
          <Search size={22} />
        </Link>
        <Link href="/my-list" className="text-gray-300 hover:text-white hover:scale-110 transition-all duration-300">
          <Heart size={22} />
        </Link>
      </div>
    </nav>
  );
}
