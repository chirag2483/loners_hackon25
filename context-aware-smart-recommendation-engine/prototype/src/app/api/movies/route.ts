import { NextResponse } from 'next/server';

const TMDB_API_KEY = "74e2f530dc2043c61539510219328bdf";
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET() {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch trending movies: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
} 