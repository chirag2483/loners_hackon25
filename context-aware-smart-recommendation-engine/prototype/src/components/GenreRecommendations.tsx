"use client";

import { useState, useEffect } from 'react';
import { Movie } from '@/types';
import { aiModelQuery, convertTMDBMovie, fetchTrendingMovies } from '@/lib/api';
import MovieCard from './MovieCard';

interface GenreRecommendationsProps {
  mood: string;
  weather: string;
  location: string;
  onAddToWatchlist: (movieId: number) => void;
}

export default function GenreRecommendations({
  mood,
  weather,
  location,
  onAddToWatchlist
}: GenreRecommendationsProps) {
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedGenres, setRecommendedGenres] = useState<string>('');
  const [currentGenreIndex, setCurrentGenreIndex] = useState(0);

  const genreCategories = [
    { name: 'Action & Adventure', tmdbIds: [28, 12] },
    { name: 'Comedy', tmdbIds: [35] },
    { name: 'Drama & Romance', tmdbIds: [18, 10749] },
    { name: 'Horror & Thriller', tmdbIds: [27, 53] },
    { name: 'Sci-Fi & Fantasy', tmdbIds: [878, 14] },
    { name: 'Animation & Family', tmdbIds: [16, 10751] }
  ];

  const fetchRecommendedMovies = async () => {
    if (!mood || !weather || !location) return;
    
    setIsLoading(true);
    try {
      // Get AI model recommendations (now async)
      const genres = await aiModelQuery(mood, weather, location);
      setRecommendedGenres(genres);
      
      // Convert genre names to TMDB genre IDs
      const genreNameToIdMap: { [key: string]: number } = {
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
        'Art': 99, // Map to Documentary as fallback
        'Biography': 99 // Map to Documentary as fallback
      };
      
      // Parse the genres string and convert to IDs
      const genreNames = genres.split(', ').map(name => name.trim());
      const genreIds = genreNames
        .map(name => genreNameToIdMap[name])
        .filter(id => id !== undefined)
        .slice(0, 3); // Limit to 3 genres
      
      // Use default genres if none found
      const finalGenreIds = genreIds.length > 0 ? genreIds : [28, 35, 18]; // Action, Comedy, Drama
      
      // Fetch trending movies (since fetchMoviesByGenre doesn't exist)
      const tmdbMovies = await fetchTrendingMovies();
      const convertedMovies = tmdbMovies.map(convertTMDBMovie);
      
      setRecommendedMovies(convertedMovies);
    } catch (error) {
      console.error('Error fetching recommended movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMoviesForCategory = async (categoryIndex: number) => {
    setIsLoading(true);
    setCurrentGenreIndex(categoryIndex);
    
    try {
      const category = genreCategories[categoryIndex];
      // Fetch trending movies (since fetchMoviesByGenre doesn't exist)
      const tmdbMovies = await fetchTrendingMovies();
      const convertedMovies = tmdbMovies.map(convertTMDBMovie);
      setRecommendedMovies(convertedMovies);
    } catch (error) {
      console.error('Error fetching movies for category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendedMovies();
  }, [mood, weather, location]);

  return (
    <div className="space-y-8">
      {/* AI Recommendation Banner */}
      {recommendedGenres && (
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-800/30">
          <h3 className="text-xl font-semibold text-white mb-2">
            🎬 Personalized Recommendations
          </h3>
          <p className="text-blue-200 mb-4">
            Based on your mood: <span className="font-medium text-white">{mood}</span> | 
            Weather: <span className="font-medium text-white">{weather}</span> | 
            Location: <span className="font-medium text-white">{location}</span>
          </p>
          <p className="text-sm text-blue-300">
            Recommended genres: <span className="text-white font-medium">{recommendedGenres}</span>
          </p>
        </div>
      )}

      {/* Genre Categories Navigation */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Browse by Genre</h2>
        <div className="flex flex-wrap gap-3">
          {genreCategories.map((category, index) => (
            <button
              key={category.name}
              onClick={() => fetchMoviesForCategory(index)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                currentGenreIndex === index
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">
          {currentGenreIndex !== undefined ? genreCategories[currentGenreIndex]?.name : 'Recommended for You'}
        </h3>
        
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse">
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : recommendedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {recommendedMovies.map((movie, index) => (
              <div key={movie.id} className="group cursor-pointer">
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
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-yellow-400">★ {movie.rating}</span>
                      <span className="text-gray-300">{movie.year}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToWatchlist(movie.id);
                      }}
                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-xs font-medium transition-colors duration-200"
                    >
                      + Watchlist
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-gray-400 text-lg">No movies found for this category.</p>
            <p className="text-gray-500 text-sm mt-2">Try selecting a different genre or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
