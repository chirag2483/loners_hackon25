export interface Movie {
  id: number;
  title: string;
  genre: string;
  rating: number;
  synopsis: string;
  posterUrl: string;
  year: number;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
  icon: string;
}

export interface UserContext {
  health: 'healthy' | 'ill';
  social: 'alone' | 'partner' | 'friends';
}

export interface MovieRecommendation {
  movie: Movie;
  confidence: number;
  reason: string;
} 