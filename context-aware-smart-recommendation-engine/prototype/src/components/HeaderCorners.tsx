"use client";

import { useState, useEffect } from "react";
import { WeatherData, fetchWeatherData } from "@/lib/api";

interface HeaderCornersProps {
  weather: WeatherData | null;
  userLocation: string;
}

export default function HeaderCorners({ 
  weather, 
  userLocation
}: HeaderCornersProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [realWeather, setRealWeather] = useState<WeatherData | null>(weather);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch real weather data when location is available
  useEffect(() => {
    if (userLocation && !realWeather) {
      const fetchWeather = async () => {
        const weatherData = await fetchWeatherData(37.7749, -122.4194);
        if (weatherData) {
          setRealWeather(weatherData);
        }
      };
      
      fetchWeather();
    }
  }, [userLocation, realWeather]);

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️',
      '01n': '🌙',
      '02d': '⛅',
      '02n': '☁️',
      '03d': '☁️',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌦️',
      '10n': '🌧️',
      '11d': '⛈️',
      '11n': '⛈️',
      '13d': '❄️',
      '13n': '❄️',
      '50d': '🌫️',
      '50n': '🌫️'
    };
    
    return iconMap[iconCode] || '🌤️';
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
      {/* Top Right - Time & Weather */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        <div className="bg-glass-gradient border border-orange-500/20 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-white">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            {realWeather && (
              <div className="flex items-center gap-2">
                <span className="text-xl">{getWeatherIcon(realWeather.icon)}</span>
                <span className="text-white">{realWeather.temperature}°F</span>
                <span className="text-gray-300">{realWeather.condition}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 