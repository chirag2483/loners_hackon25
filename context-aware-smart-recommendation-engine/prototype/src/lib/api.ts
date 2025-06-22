// TMDB API Configuration
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "74e2f530dc2043c61539510219328bdf";
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// OpenWeatherMap API Configuration
const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || 'ed8db25e2f69cf9320b12fc360cce66c';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

export interface TMDBResponse {
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
  icon: string;
}

export interface OpenWeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  name: string;
}

// TMDB API functions
export async function fetchTrendingMovies(): Promise<TMDBMovie[]> {
  try {
    console.log('Fetching trending movies...');
    // Direct API call instead of using /api/movies endpoint
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch trending movies: ${response.status}`);
    }
    
    const data: TMDBResponse = await response.json();
    console.log('TMDB API response:', {
      total_results: data.total_results,
      total_pages: data.total_pages,
      results_count: data.results.length,
      first_movie: data.results[0] ? {
        id: data.results[0].id,
        title: data.results[0].title,
        poster_path: data.results[0].poster_path
      } : null
    });
    
    const movies = data.results.slice(0, 20); // Return top 20 movies
    console.log(`Returning ${movies.length} trending movies`);
    return movies;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
}

export async function fetchMovieDetails(movieId: number): Promise<TMDBMovie | null> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

export async function searchMovies(query: string): Promise<TMDBMovie[]> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search movies');
    }
    
    const data: TMDBResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
}

// Weather API functions
export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    // Check if API key is valid
    if (!WEATHER_API_KEY || WEATHER_API_KEY === 'your-weather-api-key-here') {
      console.warn('Weather API key not configured');
      return null;
    }

    const response = await fetch(
      `${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.status}`);
    }
    
    const data: OpenWeatherResponse = await response.json();
    
    return {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      location: data.name,
      icon: data.weather[0].icon
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

// Helper function to fetch movies by specific TMDB genre IDs
export async function fetchMoviesByGenreIds(genreIds: number[]): Promise<TMDBMovie[]> {
  try {
    if (genreIds.length === 0) {
      return await fetchTrendingMovies();
    }

    const genreQuery = genreIds.join(',');
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&with_genres=${genreQuery}&page=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch movies by genre');
    }
    
    const data: TMDBResponse = await response.json();
    return data.results.slice(0, 20);
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    return await fetchTrendingMovies(); // Fallback to trending
  }
}

// Utility function to convert TMDB movie to our Movie interface
export function convertTMDBMovie(tmdbMovie: TMDBMovie) {
  console.log('Converting TMDB movie:', {
    id: tmdbMovie.id,
    title: tmdbMovie.title,
    poster_path: tmdbMovie.poster_path
  });

  const posterUrl = tmdbMovie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
    : 'https://images.unsplash.com/photo-1489599832527-2b8e0f5a9b9b?w=500&h=750&fit=crop';
  
  console.log('Generated poster URL:', posterUrl);
  
  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title,
    genre: 'Movie', // You could fetch genres separately if needed
    rating: Math.round(tmdbMovie.vote_average * 10) / 10,
    synopsis: tmdbMovie.overview,
    posterUrl,
    year: new Date(tmdbMovie.release_date).getFullYear()
  };
}

// Genre mapping from CSV file
const GENRE_MAP: { [key: number]: string } = {
  [-1]: 'Missing',
  1: 'Action',
  2: 'Adventure',
  3: 'Animation',
  4: 'Art',
  5: 'Biography',
  6: 'Comedy',
  7: 'Crime',
  8: 'Documentary',
  9: 'Drama',
  10: 'Family',
  11: 'Fantasy',
  12: 'History',
  13: 'Horror',
  14: 'Music',
  15: 'Musical',
  16: 'Mystery',
  17: 'Romance',
  18: 'Sci-Fi',
  19: 'Sport',
  20: 'Thriller',
  21: 'War',
  22: 'Western'
};

export function aiModelQuery(emotion: string, weather: string, location: string): string {
  // Emotion to genre mapping based on user's specific rules
  const emotionToGenres: { [key: string]: string[] } = {
    'sad': ['Drama'],
    'happy': ['Adventure', 'Mystery'],
    'fearful': ['Family'],
    'surprise': ['Action-Comedy'],
    'neutral': ['War/History'],
    'calm': ['Documentary', 'Biography'],
    'disgust': ['Horror'],
    'angry': ['Action', 'Thriller']
  };

  // Map genre names to TMDB IDs for the specific genres mentioned
  const genreNameToTMDBId: { [key: string]: number } = {
    'Drama': 18,
    'Fantasy': 14,
    'Adventure': 12,
    'Mystery': 9648,
    'Rom-Com': 35, // Comedy (closest to Rom-Com)
    'Family': 10751,
    'Game-Show': 10764, // TV genre, fallback to Family
    'Action-Comedy': 28, // Action (closest to Action-Comedy)
    'War/History': 10752, // War (closest to War/History)
    'Documentary': 99,
    'Biography': 99, // Documentary (closest to Biography)
    'Musical': 10402,
    'Horror': 27,
    'Film-Noir': 80, // Crime (closest to Film-Noir)
    'Action': 28,
    'Thriller': 53
  };

  // Get the emotion mapping (case-insensitive)
  const emotionKey = Object.keys(emotionToGenres).find(key => 
    key.toLowerCase() === emotion.toLowerCase()
  ) || 'happy'; // Default to happy if emotion not found

  const emotionGenres = emotionToGenres[emotionKey];

  // Convert genre names to TMDB IDs
  const genreIds: number[] = emotionGenres.map(genreName => {
    const tmdbId = genreNameToTMDBId[genreName];
    return tmdbId || 28; // Default to Action if genre not found
  });

  // Weather influence (simplified to avoid conflicts with emotion-based selection)
  const weatherInfluence: { [key: string]: number[] } = {
    'Rain': [18, 17], // Drama, Romance
    'Snow': [10751, 35], // Family, Comedy
    'Clear': [28, 12], // Action, Adventure
    'Clouds': [18, 99], // Drama, Documentary
    'Thunderstorm': [53, 27], // Thriller, Horror
    'Drizzle': [17, 35], // Romance, Comedy
    'Fog': [9648, 53], // Mystery, Thriller
    'Mist': [18, 17], // Drama, Romance
    'Smoke': [53, 80], // Thriller, Crime
    'Haze': [99, 36], // Documentary, History
    'Dust': [28, 12], // Action, Adventure
    'Sand': [10752, 37], // War, Western
    'Ash': [27, 53], // Horror, Thriller
    'Squall': [53, 28], // Thriller, Action
    'Tornado': [27, 53], // Horror, Thriller
    'Unknown': [35, 12, 18] // Comedy, Adventure, Drama
  };

  // Get weather-influenced genres
  const weatherGenres = weatherInfluence[weather] || weatherInfluence['Unknown'];
  
  // Combine emotion-based genres with weather influence
  const combinedGenres = [...genreIds];
  
  // Add weather-influenced genres if they're not already included
  weatherGenres.forEach(genreId => {
    if (!combinedGenres.includes(genreId) && combinedGenres.length < 5) {
      combinedGenres.push(genreId);
    }
  });

  // Map the genre IDs to genre names
  const genres: string[] = combinedGenres.map(genreCode => {
    const genre = GENRE_MAP[genreCode];
    if (!genre || genre.trim() === '') {
      return 'Unknown';
    }
    return genre;
  });
  
  // Return genres as a comma-separated string
  return genres.join(', ');
}