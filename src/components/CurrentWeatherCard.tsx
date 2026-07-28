import React, { useState } from 'react';
import {
  Sun,
  SunMedium,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudLightning,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Share2,
  Check,
  Sparkles,
  MapPin,
  Calendar,
  Thermometer,
  ShieldAlert,
} from 'lucide-react';
import { FullWeatherData, TemperatureUnit } from '../types';
import { getWeatherCodeInfo } from '../utils/weatherCodes';
import { formatTemperature, formatWindSpeed, getUvCategory, getAqiCategory } from '../utils/unitConverters';

interface CurrentWeatherCardProps {
  data: FullWeatherData;
  unit: TemperatureUnit;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Sun,
  SunMedium,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudLightning,
};

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ data, unit }) => {
  const [copied, setCopied] = useState(false);
  const { location, current, daily, airQuality } = data;
  const weatherInfo = getWeatherCodeInfo(current.weatherCode);
  const IconComponent = ICON_MAP[weatherInfo.iconName] || Cloud;

  const bgGradient = current.isDay ? weatherInfo.bgGradientDay : weatherInfo.bgGradientNight;
  const todayDaily = daily[0];
  const uvCat = getUvCategory(current.uvIndex);
  const aqiCat = airQuality ? getAqiCategory(airQuality.usAqi) : null;

  const localTimeStr = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const handleShare = () => {
    const text = `Weather in ${location.name}, ${location.country}: ${weatherInfo.description}, Temp: ${formatTemperature(current.temperature, unit)} (Feels like ${formatTemperature(current.apparentTemperature, unit)}). High/Low: ${formatTemperature(todayDaily.tempMax, unit)} / ${formatTemperature(todayDaily.tempMin, unit)}. Humidity: ${current.relativeHumidity}%, Wind: ${formatWindSpeed(current.windSpeed, unit)}. Powered by Weather Intelligence App.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      id="current-weather-hero"
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${bgGradient} text-white shadow-2xl p-6 sm:p-8 transition-all duration-500 border border-white/20`}
    >
      {/* Background Atmospheric Visual Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] pointer-events-none" />
      
      {/* Decorative Glow Circles */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col justify-between h-full gap-6">
        
        {/* Top Row: Location Header & Share */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white/15 backdrop-blur-md border border-white/20 text-sky-200">
                <MapPin className="w-4 h-4" />
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm">
                {location.name}
              </h2>
              {location.country_code && (
                <span className="px-2 py-0.5 text-xs font-bold uppercase rounded-md bg-white/20 border border-white/30 backdrop-blur-md">
                  {location.country_code}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs sm:text-sm text-sky-100/90 font-medium flex items-center gap-2">
              <span>{location.admin1 ? `${location.admin1}, ` : ''}{location.country}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {localTimeStr}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {current.isDay ? 'Daytime' : 'Nighttime'}
            </span>

            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-md"
              title="Copy weather snapshot text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Middle Row: Temperature & Weather Condition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-2">
          
          {/* Main Giant Temp */}
          <div className="flex items-baseline gap-4">
            <div className="text-6xl sm:text-7xl font-black tracking-tighter drop-shadow-md">
              {formatTemperature(current.temperature, unit)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sky-100 flex items-center gap-1">
                <Thermometer className="w-4 h-4 text-amber-300" />
                Feels like {formatTemperature(current.apparentTemperature, unit)}
              </span>
              {todayDaily && (
                <span className="text-xs font-medium text-white/80 mt-1">
                  High: <strong className="text-white">{formatTemperature(todayDaily.tempMax, unit)}</strong> • Low:{' '}
                  <strong className="text-white/90">{formatTemperature(todayDaily.tempMin, unit)}</strong>
                </span>
              )}
            </div>
          </div>

          {/* Condition Icon & Description */}
          <div className="flex items-center gap-4 md:justify-end">
            <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 shadow-xl flex items-center justify-center shrink-0">
              <IconComponent className="w-12 h-12 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold capitalize drop-shadow-sm">
                {weatherInfo.description}
              </div>
              <p className="text-xs text-sky-100/90 font-medium mt-0.5 max-w-xs">
                {current.precipitation > 0
                  ? `Active precipitation: ${current.precipitation} mm`
                  : current.cloudCover > 50
                  ? `${current.cloudCover}% cloud cover overhead`
                  : 'Clear conditions with comfortable sky stability'}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Row: Key Weather Metrics Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/20">
          
          {/* Wind Speed */}
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/20 border border-sky-300/30 text-sky-200">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-sky-100/80 font-medium">Wind Speed</div>
              <div className="text-sm font-bold text-white">
                {formatWindSpeed(current.windSpeed, unit)}
              </div>
            </div>
          </div>

          {/* Relative Humidity */}
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-300/30 text-blue-200">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-sky-100/80 font-medium">Humidity</div>
              <div className="text-sm font-bold text-white">
                {current.relativeHumidity}%
              </div>
            </div>
          </div>

          {/* UV Index */}
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-300/30 text-amber-200">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-sky-100/80 font-medium">UV Index</div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{current.uvIndex}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${uvCat.badge}`}>
                  {uvCat.label}
                </span>
              </div>
            </div>
          </div>

          {/* Air Quality Index */}
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-300/30 text-emerald-200">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-sky-100/80 font-medium">Air Quality</div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{airQuality?.usAqi ?? '35'} AQI</span>
                {aqiCat && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${aqiCat.bg} ${aqiCat.text}`}>
                    {aqiCat.label}
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
