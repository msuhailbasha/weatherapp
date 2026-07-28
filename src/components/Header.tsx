import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Star, Compass, RefreshCw, Sun, Moon, Sparkles, Clock, X } from 'lucide-react';
import { LocationData, TemperatureUnit } from '../types';
import { searchCities, POPULAR_CITIES, getLocationFromCoords } from '../services/weatherApi';

interface HeaderProps {
  currentLocation: LocationData | null;
  onSelectCity: (city: LocationData) => void;
  unit: TemperatureUnit;
  onToggleUnit: (unit: TemperatureUnit) => void;
  favorites: LocationData[];
  onToggleFavorite: (city: LocationData) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onSelectCity,
  unit,
  onToggleUnit,
  favorites,
  onToggleFavorite,
  onRefresh,
  isLoading,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<LocationData[]>([]);
  const [geoLoading, setGeoLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('weather_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading recent searches', e);
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpenDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search debounce
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const res = await searchCities(query);
      setResults(res);
      setIsSearching(false);
      setIsOpenDropdown(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (city: LocationData) => {
    onSelectCity(city);
    setQuery('');
    setIsOpenDropdown(false);

    // Save to recents
    setRecentSearches((prev) => {
      const filtered = prev.filter((c) => c.id !== city.id);
      const updated = [city, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('weather_recent_searches', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const loc = await getLocationFromCoords(pos.coords.latitude, pos.coords.longitude);
          handleSelect(loc);
        } catch (err) {
          alert('Could not resolve location address.');
        } finally {
          setGeoLoading(false);
        }
      },
      (err) => {
        setGeoLoading(false);
        alert(`Location permission denied or unavailable: ${err.message}`);
      },
      { timeout: 10000 }
    );
  };

  const isCurrentFav = currentLocation ? favorites.some((f) => f.id === currentLocation.id) : false;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-sky-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-sky-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-sky-100 to-sky-300">
                  Weather Intelligence
                </h1>
                <p className="text-xs text-sky-400/80 font-medium flex items-center gap-1">
                  <span>Open-Meteo Engine</span>
                  <span className="inline-block w-1 h-1 rounded-full bg-sky-400"></span>
                  <span>Smart Insights</span>
                </p>
              </div>
            </div>

            {/* Mobile Actions Right */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={onRefresh}
                disabled={isLoading}
                title="Refresh Weather Data"
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
              </button>

              <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs font-semibold">
                <button
                  onClick={() => onToggleUnit('C')}
                  className={`px-2 py-1 rounded-md transition ${unit === 'C' ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  °C
                </button>
                <button
                  onClick={() => onToggleUnit('F')}
                  className={`px-2 py-1 rounded-md transition ${unit === 'F' ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  °F
                </button>
              </div>
            </div>
          </div>

          {/* Search Box & Controls */}
          <div className="flex-1 max-w-2xl flex items-center gap-2">
            
            {/* Search Input Container */}
            <div ref={searchRef} className="relative flex-1">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => {
                    if (query.trim().length >= 2 || recentSearches.length > 0) {
                      setIsOpenDropdown(true);
                    }
                  }}
                  placeholder="Search city, region, or country..."
                  className="w-full pl-10 pr-10 py-2 bg-slate-800/90 hover:bg-slate-800 focus:bg-slate-800 border border-slate-700/80 focus:border-sky-500 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition shadow-inner"
                />
                {query && (
                  <button
                    onClick={() => {
                      setQuery('');
                      setResults([]);
                    }}
                    className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {isOpenDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
                  
                  {/* Active Search Results */}
                  {query.trim().length >= 2 ? (
                    <div>
                      <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/40">
                        {isSearching ? 'Searching global places...' : `Search Results (${results.length})`}
                      </div>
                      {isSearching ? (
                        <div className="p-4 text-center text-sm text-slate-400 flex items-center justify-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
                          Fetching locations...
                        </div>
                      ) : results.length > 0 ? (
                        <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/50">
                          {results.map((city) => (
                            <button
                              key={city.id}
                              onClick={() => handleSelect(city)}
                              className="w-full text-left px-4 py-2.5 hover:bg-sky-500/10 flex items-center justify-between group transition"
                            >
                              <div>
                                <div className="text-sm font-medium text-white group-hover:text-sky-300">
                                  {city.name}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                                </div>
                              </div>
                              <div className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded text-right">
                                {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-slate-400">
                          No matching cities found for "{query}".
                        </div>
                      )}
                    </div>
                  ) : null}

                  {/* Recent Searches */}
                  {recentSearches.length > 0 && query.trim().length < 2 && (
                    <div>
                      <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/40 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-sky-400" /> Recent Searches
                      </div>
                      <div className="divide-y divide-slate-800/50">
                        {recentSearches.map((city) => (
                          <button
                            key={`recent-${city.id}`}
                            onClick={() => handleSelect(city)}
                            className="w-full text-left px-4 py-2 hover:bg-slate-800 flex items-center justify-between group transition"
                          >
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-400" />
                              <span className="text-sm text-slate-200 group-hover:text-white font-medium">
                                {city.name}, <span className="text-xs text-slate-400">{city.country}</span>
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Popular Cities */}
                  {query.trim().length < 2 && (
                    <div>
                      <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/40 flex items-center gap-1.5">
                        <Compass className="w-3 h-3 text-amber-400" /> Popular Destinations
                      </div>
                      <div className="p-2 grid grid-cols-2 gap-1.5">
                        {POPULAR_CITIES.slice(0, 6).map((city) => (
                          <button
                            key={`pop-${city.id}`}
                            onClick={() => handleSelect(city)}
                            className="px-2.5 py-1.5 text-left rounded-lg bg-slate-800/60 hover:bg-sky-500/20 text-xs font-medium text-slate-300 hover:text-sky-200 transition flex items-center justify-between"
                          >
                            <span>{city.name}</span>
                            <span className="text-[10px] text-slate-500 uppercase">{city.country_code}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Use Geolocation Button */}
            <button
              onClick={handleUseCurrentLocation}
              disabled={geoLoading}
              title="Detect current GPS location"
              className="px-3 py-2 rounded-xl bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/20 text-sky-400 text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
            >
              <MapPin className={`w-4 h-4 ${geoLoading ? 'animate-bounce text-sky-300' : ''}`} />
              <span className="hidden sm:inline">{geoLoading ? 'Locating...' : 'My Location'}</span>
            </button>

            {/* Favorite Current City Toggle */}
            {currentLocation && (
              <button
                onClick={() => onToggleFavorite(currentLocation)}
                title={isCurrentFav ? 'Remove from favorites' : 'Save to favorites'}
                className={`p-2 rounded-xl border transition shrink-0 ${
                  isCurrentFav
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-amber-400 hover:border-amber-500/30'
                }`}
              >
                <Star className={`w-4 h-4 ${isCurrentFav ? 'fill-amber-400' : ''}`} />
              </button>
            )}

            {/* Desktop Refresh & Unit Switcher */}
            <div className="hidden md:flex items-center gap-2 border-l border-slate-800 pl-2">
              <button
                onClick={onRefresh}
                disabled={isLoading}
                title="Refresh Weather Data"
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
              </button>

              <div className="flex bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-xs font-semibold">
                <button
                  onClick={() => onToggleUnit('C')}
                  className={`px-2.5 py-1 rounded-lg transition ${unit === 'C' ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  °C
                </button>
                <button
                  onClick={() => onToggleUnit('F')}
                  className={`px-2.5 py-1 rounded-lg transition ${unit === 'F' ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  °F
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Favorite Cities Quick Bar */}
        {favorites.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-semibold uppercase text-amber-400/80 tracking-wider flex items-center gap-1 shrink-0">
              <Star className="w-3 h-3 fill-amber-400" /> Favorites:
            </span>
            <div className="flex items-center gap-1.5 pb-0.5">
              {favorites.map((fav) => (
                <button
                  key={`fav-${fav.id}`}
                  onClick={() => onSelectCity(fav)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition shrink-0 flex items-center gap-1 ${
                    currentLocation?.id === fav.id
                      ? 'bg-sky-500 text-white font-semibold'
                      : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                  }`}
                >
                  <span>{fav.name}</span>
                  <span className="text-[10px] opacity-75">({fav.country_code})</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
