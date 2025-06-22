"use client";

import { useState, useEffect, useRef } from 'react';
import { Movie } from '@/types';
import { aiModelQuery, fetchMoviesByGenreIds, convertTMDBMovie } from '@/lib/api';

interface GenreMovieRowsProps {
  mood: string;
  weather: string;
  location: string;
  onAddToWatchlist: (movieId: number) => void;
  onMoviesLoaded?: (movies: Movie[]) => void;
}

interface GenreRow {
  name: string;
  tmdbId: number;
  movies: Movie[];
  isLoading: boolean;
}

export default function GenreMovieRows({
  mood,
  weather,
  location,
  onAddToWatchlist,
  onMoviesLoaded
}: GenreMovieRowsProps) {
  const [genreRows, setGenreRows] = useState<GenreRow[]>([]);
  const [recommendedGenres, setRecommendedGenres] = useState<string>("");
  
  // Scroll functions
  const scrollLeft = (genreName: string) => {
    const element = document.getElementById(`scroll-${genreName}`);
    if (element) {
      element.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = (genreName: string) => {
    const element = document.getElementById(`scroll-${genreName}`);
    if (element) {
      element.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Map genre names to TMDB IDs
  const genreNameToTMDBId: { [key: string]: number } = {
    'Action': 28,
    'Adventure': 12,
    'Animation': 16,
    'Comedy': 35,
    'Crime': 80,
    'Documentary': 99,
    'Drama': 18,
    'Family': 10751,
    'Fantasy': 14,
    'History': 36,
    'Horror': 27,
    'Music': 10402,
    'Musical': 10402,
    'Mystery': 9648,
    'Romance': 10749,
    'Sci-Fi': 878,
    'Science Fiction': 878,
    'Sport': 9648,
    'Thriller': 53,
    'War': 10752,
    'Western': 37,
    'Art': 99,
    'Biography': 99
  };

  useEffect(() => {
    const loadGenreMovies = async () => {
      if (!mood || !weather || !location) return;

      try {
        // Get AI recommended genres
        const genresString = aiModelQuery(mood, weather, location);
        setRecommendedGenres(genresString);
        
        // Parse genres and create rows
        const genreNames = genresString.split(', ').map(name => name.trim());
        
        // Initialize genre rows
        const initialRows: GenreRow[] = genreNames.map(name => ({
          name,
          tmdbId: genreNameToTMDBId[name] || 28, // Default to Action if not found
          movies: [],
          isLoading: true
        }));
        
        setGenreRows(initialRows);

        // Fetch movies for each genre
        for (let i = 0; i < initialRows.length; i++) {
          const genreRow = initialRows[i];
          
          try {
            const tmdbMovies = await fetchMoviesByGenreIds([genreRow.tmdbId]);
            const convertedMovies = tmdbMovies.map(convertTMDBMovie);
            
            setGenreRows(prev => prev.map((row, index) => 
              index === i ? { ...row, movies: convertedMovies, isLoading: false } : row
            ));
          } catch (error) {
            console.error(`Error fetching movies for ${genreRow.name}:`, error);
            setGenreRows(prev => prev.map((row, index) => 
              index === i ? { ...row, movies: [], isLoading: false } : row
            ));
          }
        }
      } catch (error) {
        console.error('Error loading genre movies:', error);
      }
    };

    loadGenreMovies();
  }, [mood, weather, location]);

  // Collect all movies and pass them to parent component
  useEffect(() => {
    if (onMoviesLoaded && genreRows.length > 0 && !genreRows.some(row => row.isLoading)) {
      const allMovies = genreRows.flatMap(row => row.movies);
      onMoviesLoaded(allMovies);
    }
  }, [genreRows, onMoviesLoaded]);

  return (
    <div className="space-y-8">
      {/* AI Recommendation Banner */}
      {recommendedGenres && (
        <div className="mb-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-800/30">
          <h3 className="text-xl font-semibold text-white mb-2">
            🎬 Personalized Recommendations
          </h3>
          <p className="text-blue-200 mb-4">
            Based on your emotion: <span className="font-medium text-white">{mood}</span> | 
            Weather: <span className="font-medium text-white">{weather}</span> | 
            Location: <span className="font-medium text-white">{location}</span>
          </p>
          <p className="text-sm text-blue-300">
            Recommended genres: <span className="text-white font-medium">{recommendedGenres}</span>
          </p>
        </div>
      )}

      {/* Genre Rows */}
      {genreRows.map((genreRow, genreIndex) => (
        <div key={genreIndex} className="space-y-4">
          {/* Genre Title */}
          <h2 className="text-2xl font-bold text-white pl-4">
            {genreRow.name} Movies
          </h2>
          
          {/* Horizontal Scrollable Movie Row */}
          <div className="relative group">
            {/* Left Navigation Arrow */}
            <button
              onClick={() => scrollLeft(genreRow.name)}
              className="scroll-arrow absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
              aria-label="Scroll left"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
              </svg>
            </button>

            {/* Right Navigation Arrow */}
            <button
              onClick={() => scrollRight(genreRow.name)}
              className="scroll-arrow absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
              aria-label="Scroll right"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>

            {genreRow.isLoading ? (
              // Loading skeleton
              <div className="flex space-x-4 overflow-x-auto pb-4 px-4 scrollbar-hide">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-48">
                    <div className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"></div>
                    <div className="mt-2 space-y-1">
                      <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-700 rounded w-2/3 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : genreRow.movies.length > 0 ? (
              <div 
                id={`scroll-${genreRow.name}`}
                className="flex space-x-4 overflow-x-auto pb-4 px-4 scrollbar-hide scroll-smooth"
              >
                {genreRow.movies.map((movie) => (
                  <div key={movie.id} className="flex-shrink-0 w-48 group cursor-pointer">
                    <div className="aspect-[2/3] relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                          {movie.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-yellow-400">★ {movie.rating}</span>
                          <span className="text-gray-300">{movie.year}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToWatchlist(movie.id);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-xs font-medium transition-colors duration-200"
                        >
                          + Watchlist
                        </button>
                      </div>
                    </div>
                    
                    {/* Movie Info */}
                    <div className="mt-2 px-1">
                      <h4 className="text-white font-medium text-sm line-clamp-1 mb-1">
                        {movie.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>★ {movie.rating}</span>
                        <span>{movie.year}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 px-4">
                <p className="text-gray-400">No {genreRow.name.toLowerCase()} movies found</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
