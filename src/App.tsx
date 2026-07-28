import React, { useState, useEffect, useCallback } from 'react';
import { LocationData, FullWeatherData, TemperatureUnit } from './types';
import { POPULAR_CITIES, fetchFullWeatherData } from './services/weatherApi';
import { generateWeatherIntelligence } from './utils/intelligenceEngine';
import { Header } from './components/Header';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { WeatherIntelligenceCard } from './components/WeatherIntelligenceCard';
import { HourlyForecastChart } from './components/HourlyForecastChart';
import { SevenDayForecast } from './components/SevenDayForecast';
import { DetailedMetricsGrid } from './components/DetailedMetricsGrid';
import { AirQualityCard } from './components/AirQualityCard';
import { Footer } from './components/Footer';
import { RefreshCw, AlertCircle, Sparkles, MapPin, Search } from 'lucide-react';

export default function App() {
  const [location, setLocation] = useState<LocationData>(POPULAR_CITIES[0]); // Default to Paris or Tokyo
  const [weatherData, setWeatherData] = useState<FullWeatherData | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('C');
  const [favorites, setFavorites] = useState<LocationData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load saved preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedUnit = localStorage.getItem('weather_unit');
      if (savedUnit === 'C' || savedUnit === 'F') {
        setUnit(savedUnit);
      }

      const savedFavs = localStorage.getItem('weather_favorites');
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      }

      const savedLastLoc = localStorage.getItem('weather_last_location');
      if (savedLastLoc) {
        setLocation(JSON.parse(savedLastLoc));
      }
    } catch (e) {
      console.error('Error reading localStorage preferences', e);
    }
  }, []);

  // Fetch weather data for active location
  const loadWeather = useCallback(async (targetLoc: LocationData) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchFullWeatherData(targetLoc);
      setWeatherData(data);

      // Save last searched location
      try {
        localStorage.setItem('weather_last_location', JSON.stringify(targetLoc));
      } catch (e) {}
    } catch (err: any) {
      console.error('Failed to load weather data:', err);
      setError(err.message || 'Unable to fetch weather data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(location);
  }, [location, loadWeather]);

  // Handle City Select
  const handleSelectCity = (city: LocationData) => {
    setLocation(city);
  };

  // Toggle Unit
  const handleToggleUnit = (newUnit: TemperatureUnit) => {
    setUnit(newUnit);
    try {
      localStorage.setItem('weather_unit', newUnit);
    } catch (e) {}
  };

  // Toggle Favorite
  const handleToggleFavorite = (city: LocationData) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === city.id);
      const updated = exists ? prev.filter((f) => f.id !== city.id) : [...prev, city];
      try {
        localStorage.setItem('weather_favorites', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const insights = weatherData ? generateWeatherIntelligence(weatherData) : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white flex flex-col justify-between">
      <div>
        {/* Navbar */}
        <Header
          currentLocation={location}
          onSelectCity={handleSelectCity}
          unit={unit}
          onToggleUnit={handleToggleUnit}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onRefresh={() => loadWeather(location)}
          isLoading={isLoading}
        />

        {/* Main Dashboard Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Error Notice */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
              <button
                onClick={() => loadWeather(location)}
                className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && !weatherData && (
            <div className="space-y-6 animate-pulse">
              <div className="h-64 bg-slate-900 rounded-3xl border border-slate-800" />
              <div className="h-48 bg-slate-900 rounded-3xl border border-slate-800" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-40 bg-slate-900 rounded-2xl" />
                <div className="h-40 bg-slate-900 rounded-2xl" />
                <div className="h-40 bg-slate-900 rounded-2xl" />
              </div>
            </div>
          )}

          {/* Weather Content */}
          {weatherData && insights && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* 1. Hero Current Weather Card */}
              <CurrentWeatherCard data={weatherData} unit={unit} />

              {/* 2. Weather Intelligence Advisory Engine */}
              <WeatherIntelligenceCard insights={insights} />

              {/* 3. Hourly Forecast Chart & Slider */}
              <HourlyForecastChart hourly={weatherData.hourly} unit={unit} />

              {/* 4. 7-Day Extended Forecast */}
              <SevenDayForecast daily={weatherData.daily} unit={unit} />

              {/* 5. Comprehensive Telemetry Grid */}
              <DetailedMetricsGrid
                current={weatherData.current}
                todayDaily={weatherData.daily[0]}
                unit={unit}
              />

              {/* 6. Air Quality Index & Pollutants Breakdown */}
              <AirQualityCard airQuality={weatherData.airQuality} />

            </div>
          )}

        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
