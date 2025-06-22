"use client";

import Image from "next/image";
import { Movie } from "@/types";
import { useState } from "react";

interface MovieCardProps {
  movie: Movie;
  index: number;
  onAddToWatchlist: (movieId: number) => void;
}

export default function MovieCard({ movie, index, onAddToWatchlist }: MovieCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Debug logging
  console.log(`MovieCard ${index}:`, {
    title: movie.title,
    posterUrl: movie.posterUrl,
    id: movie.id
  });

  const handleImageError = () => {
    console.error(`Failed to load image for movie: ${movie.title}`, movie.posterUrl);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div
      className="bg-card-bg border border-card-border rounded-lg overflow-hidden hover:border-primary transition-all duration-300 animate-fade-in group"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative">
        <div className="w-full h-64 bg-secondary relative overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
              <div className="text-gray-400 text-sm">Loading...</div>
            </div>
          )}
          
          {!imageError ? (
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
              onLoad={handleImageLoad}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2">🎬</div>
                <div className="text-sm">No Image</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-75 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center p-4">
            <p className="text-sm text-white mb-4 line-clamp-3">{movie.synopsis}</p>
            <button
              onClick={() => onAddToWatchlist(movie.id)}
              className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-colors"
            >
              Add to Watchlist
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{movie.title}</h3>
          <span className="bg-accent text-black px-2 py-1 rounded text-xs font-bold">
            {movie.rating}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>{movie.genre}</span>
          <span>{movie.year}</span>
        </div>
      </div>
    </div>
  );
} 