"use client";

import { useState, useEffect } from "react";
import HeaderCorners from "@/components/HeaderCorners";
import VoiceSearch from "@/components/VoiceSearch";
import VoiceEmotionDetector from "@/components/VoiceEmotionDetector";
import MovieCard from "@/components/MovieCard";
import BingeOfTheDay from "@/components/BingeOfTheDay";
import GenreMovieRows from "@/components/GenreMovieRows";
import { Movie, WeatherData } from "@/types";
import { searchMovies, convertTMDBMovie, aiModelQuery, fetchWeatherData } from "@/lib/api";

export default function MovieRecommender() {
  const [userLocation, setUserLocation] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [userMood, setUserMood] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [predictedGenreMovies, setPredictedGenreMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasUpdatedBingeOfTheDay, setHasUpdatedBingeOfTheDay] = useState(false);

  // Get user location and weather
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Fetch weather data
          const weather = await fetchWeatherData(latitude, longitude);
          if (weather) {
            setWeatherData(weather);
            setUserLocation(weather.location);
          } else {
            setUserLocation("San Francisco, CA"); // Fallback
          }
        },
        (error) => {
          console.log("Location access denied");
          setUserLocation("San Francisco, CA"); // Fallback
        }
      );
    } else {
      setUserLocation("San Francisco, CA"); // Fallback
    }
  }, []);

  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim()) {
      setIsSearching(true);
      try {
        const tmdbResults = await searchMovies(query);
        const convertedResults = tmdbResults.map(convertTMDBMovie);
        setSearchResults(convertedResults);
      } catch (error) {
        console.error('Error searching movies:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleTranscriptChange = (transcript: string) => {
    // This is handled by the VoiceSearch component
  };

  const handleEmotionDetected = (emotion: string) => {
    setUserMood(emotion);
    setHasUpdatedBingeOfTheDay(false); // Reset the flag when new emotion is detected
  };

  const handlePredictedMoviesLoaded = (movies: Movie[]) => {
    setPredictedGenreMovies(movies);
    
    // Only update Binge of the Day once when movies are first loaded
    if (movies.length > 0 && !hasUpdatedBingeOfTheDay) {
      const randomIndex = Math.floor(Math.random() * movies.length);
      setFeaturedMovie(movies[randomIndex]);
      setHasUpdatedBingeOfTheDay(true);
    }
  };

  const addToWatchlist = (movieId: number) => {
    // In a real app, this would save to a database
    console.log(`Added movie ${movieId} to watchlist`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Corners - Time/Weather */}
      <HeaderCorners
        weather={weatherData}
        userLocation={userLocation}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 pt-20">
        {/* Voice Emotion Detection Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">
            How are you feeling today?
          </h2>
          
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <VoiceEmotionDetector
                currentEmotion={userMood}
                onEmotionDetected={handleEmotionDetected}
              />
            </div>
          </div>

          {/* Current Mood Display */}
          {userMood ? (
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">Detected Mood:</p>
              <p className="text-white text-lg font-semibold capitalize">{userMood}</p>
            </div>
          ) : (
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">Click the microphone to detect your mood from voice</p>
            </div>
          )}
        </div>

        {/* Binge of the Day Banner - Only show after emotion detection */}
        {userMood && featuredMovie && (
          <BingeOfTheDay featuredMovie={featuredMovie} isLoading={false} />
        )}

        {/* Movie Recommendations */}
        <div className="mb-8">
          {searchQuery ? (
            // Show search results in grid format
            <>
              <h2 className="text-2xl font-bold mb-6 text-white">
                Search Results for "{searchQuery}"
              </h2>
              
              {isSearching ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-card-bg border border-card-border rounded-lg overflow-hidden">
                      <div className="skeleton h-64 w-full"></div>
                      <div className="p-4 space-y-2">
                        <div className="skeleton h-4 w-3/4"></div>
                        <div className="skeleton h-3 w-1/2"></div>
                        <div className="skeleton h-3 w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {searchResults.map((movie, index) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      index={index}
                      onAddToWatchlist={addToWatchlist}
                    />
                  ))}
                </div>
              )}
              
              {searchResults.length === 0 && !isSearching && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No movies found matching your search.</p>
                </div>
              )}
            </>
          ) : userMood ? (
            // Show genre-based movie rows for recommendations after emotion detection
            <GenreMovieRows
              mood={userMood}
              weather={weatherData?.condition || 'Unknown'}
              location={userLocation}
              onAddToWatchlist={addToWatchlist}
              onMoviesLoaded={handlePredictedMoviesLoaded}
            />
          ) : (
            // Show initial state - no movies until emotion is detected
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎬</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Discover Your Perfect Movies
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Use voice emotion detection above to get personalized movie recommendations 
                based on your mood, weather, and location.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Voice Search Icon (Fixed Position) */}
      <VoiceSearch
        onTranscriptChange={handleTranscriptChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
    </div>
  );
}
