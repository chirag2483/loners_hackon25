"use client";

import Image from "next/image";
import { Movie } from "@/types";

interface BingeOfTheDayProps {
  featuredMovie: Movie | null;
  isLoading?: boolean;
}

export default function BingeOfTheDay({ featuredMovie, isLoading = false }: BingeOfTheDayProps) {
  if (isLoading) {
    return (
      <div className="w-full min-h-[200px] md:h-56 bg-dark-gradient rounded-xl overflow-hidden mb-8">
        <div className="skeleton h-full w-full"></div>
      </div>
    );
  }

  if (!featuredMovie) {
    return null;
  }

  return (
    <div className="w-full min-h-[200px] md:h-56 bg-banner-gradient rounded-xl overflow-hidden mb-8 relative group">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Content */}
      <div className="relative h-full flex items-center p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 w-full max-w-6xl mx-auto">
          {/* Movie Poster */}
          <div className="relative w-20 h-28 md:w-24 md:h-36 flex-shrink-0">
            <Image
              src={featuredMovie.posterUrl}
              alt={featuredMovie.title}
              fill
              className="object-cover rounded-lg shadow-2xl"
            />
          </div>
          
          {/* Movie Info */}
          <div className="flex-1 text-white min-w-0 space-y-2 md:space-y-3">
            <div>
              <span className="bg-orange-500 text-black px-2 md:px-3 py-1 rounded-full text-xs font-bold">
                BINGE OF THE DAY
              </span>
            </div>
            
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold animate-float line-clamp-1">
              {featuredMovie.title}
            </h2>
            
            <div className="flex items-center gap-2 md:gap-3 flex-wrap text-xs md:text-sm">
              <span className="bg-accent text-black px-2 py-1 rounded font-bold">
                ⭐ {featuredMovie.rating}
              </span>
              <span className="text-orange-200">{featuredMovie.genre}</span>
              <span className="text-orange-200">{featuredMovie.year}</span>
            </div>
            
            <p className="text-orange-100 line-clamp-2 text-xs md:text-sm max-w-xl md:max-w-2xl">
              {featuredMovie.synopsis}
            </p>
            
            <div className="flex gap-2 md:gap-3 flex-wrap pt-1">
              <button className="bg-orange-500 hover:bg-orange-600 text-black px-3 md:px-4 py-2 rounded-lg font-semibold transition-colors text-xs md:text-sm">
                Watch Now
              </button>
              <button className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black px-3 md:px-4 py-2 rounded-lg font-semibold transition-colors text-xs md:text-sm">
                Add to List
              </button>
            </div>
          </div>
          
          {/* Decorative elements - Hidden on mobile */}
          <div className="hidden md:block absolute top-4 right-4 text-3xl lg:text-4xl opacity-20 animate-float">
            🎬
          </div>
          <div className="hidden md:block absolute bottom-4 right-4 text-2xl lg:text-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>
            🍿
          </div>
        </div>
      </div>
    </div>
  );
} 