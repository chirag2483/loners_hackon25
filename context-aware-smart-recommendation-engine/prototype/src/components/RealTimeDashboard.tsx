"use client";

import { useState, useEffect } from "react";
import { WeatherData, fetchWeatherData } from "@/lib/api";

interface RealTimeDashboardProps {
  weather: WeatherData | null;
  userLocation: string;
}

export default function RealTimeDashboard({ weather, userLocation }: RealTimeDashboardProps) {
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
      // For demo purposes, using San Francisco coordinates
      // In a real app, you'd get these from geolocation
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
    <header className="bg-card-bg border-b border-card-border p-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold text-primary">MovieAI</h1>
          <div className="text-sm text-gray-400">
            {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
          </div>
        </div>
        
        {realWeather && (
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">{getWeatherIcon(realWeather.icon)}</span>
              <span>{realWeather.temperature}°F</span>
              <span>{realWeather.condition}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>{realWeather.location}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 