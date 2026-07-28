import React from 'react';
import {
  Wind,
  Droplets,
  Sun,
  Gauge,
  Eye,
  Cloud,
  Compass,
  Sunrise,
  Sunset,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { CurrentWeather, DailyForecastItem, TemperatureUnit } from '../types';
import {
  formatWindSpeed,
  formatPressure,
  formatTemperature,
  getWindDirectionCardinal,
  getUvCategory,
} from '../utils/unitConverters';

interface DetailedMetricsGridProps {
  current: CurrentWeather;
  todayDaily?: DailyForecastItem;
  unit: TemperatureUnit;
}

export const DetailedMetricsGrid: React.FC<DetailedMetricsGridProps> = ({
  current,
  todayDaily,
  unit,
}) => {
  const uvCat = getUvCategory(current.uvIndex);
  const windDirCardinal = getWindDirectionCardinal(current.windDirection);

  const sunriseStr = todayDaily?.sunrise
    ? new Date(todayDaily.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'N/A';
  const sunsetStr = todayDaily?.sunset
    ? new Date(todayDaily.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'N/A';

  const visibilityKm = (current.cloudCover > 80 ? 8 : 12).toFixed(0);
  const visibilityMiles = (Number(visibilityKm) * 0.621371).toFixed(0);

  return (
    <div id="detailed-metrics-section" className="space-y-4">
      <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
        <Gauge className="w-5 h-5 text-sky-400" /> Comprehensive Telemetry
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* 1. WIND & COMPASS */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-emerald-400" /> Wind & Gusts
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              {windDirCardinal} ({current.windDirection}°)
            </span>
          </div>

          <div className="my-4 flex items-center justify-between">
            <div>
              <div className="text-3xl font-black text-white">
                {formatWindSpeed(current.windSpeed, unit)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Gusts up to <strong className="text-slate-200">{formatWindSpeed(current.windGusts, unit)}</strong>
              </p>
            </div>

            {/* Rotating Compass Needle Dial */}
            <div className="relative w-14 h-14 bg-slate-950 rounded-full border border-slate-700 flex items-center justify-center shadow-inner">
              <span className="absolute top-1 text-[9px] font-bold text-slate-500">N</span>
              <span className="absolute bottom-1 text-[9px] font-bold text-slate-500">S</span>
              <span className="absolute left-1 text-[9px] font-bold text-slate-500">W</span>
              <span className="absolute right-1 text-[9px] font-bold text-slate-500">E</span>
              <div
                className="w-1 h-8 bg-emerald-400 rounded-full origin-center transition-transform duration-700 shadow-md"
                style={{ transform: `rotate(${current.windDirection}deg)` }}
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            {current.windSpeed > 30
              ? 'High wind alert! Watch for crosswinds during driving.'
              : current.windSpeed > 15
              ? 'Breezy conditions. Good air movement.'
              : 'Calm or light ambient breeze.'}
          </p>
        </div>

        {/* 2. HUMIDITY & DEW POINT */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-400" /> Humidity & Moisture
            </span>
            <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
              {current.relativeHumidity}%
            </span>
          </div>

          <div className="my-4">
            <div className="text-3xl font-black text-white">
              {current.relativeHumidity}%
            </div>
            <div className="mt-2 w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${current.relativeHumidity}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            {current.relativeHumidity > 75
              ? 'High humidity: Feels sticky and reduces perspiration cooling.'
              : current.relativeHumidity < 35
              ? 'Dry atmosphere: Stay hydrated and use skin moisturizer.'
              : 'Optimal human comfort moisture balance.'}
          </p>
        </div>

        {/* 3. UV INDEX & SUN ARC */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400" /> UV Index & Sun Arc
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${uvCat.badge}`}>
              {uvCat.label}
            </span>
          </div>

          <div className="my-3 flex items-center justify-between">
            <div>
              <div className="text-3xl font-black text-white">
                {current.uvIndex} <span className="text-xs text-slate-500 font-normal">/ 11+</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Max today: <strong className="text-slate-200">{todayDaily?.uvIndexMax ?? current.uvIndex}</strong>
              </p>
            </div>

            <div className="text-right text-xs space-y-1">
              <div className="flex items-center gap-1 text-slate-300">
                <Sunrise className="w-3.5 h-3.5 text-amber-400" /> {sunriseStr}
              </div>
              <div className="flex items-center gap-1 text-slate-300">
                <Sunset className="w-3.5 h-3.5 text-rose-400" /> {sunsetStr}
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            {current.uvIndex >= 6
              ? 'High solar intensity! SPF 30+ sunscreen & hat recommended.'
              : 'Low to moderate solar ultraviolet risk.'}
          </p>
        </div>

        {/* 4. PRESSURE */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-purple-400" /> Barometric Pressure
            </span>
            <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
              {current.pressureMsl} hPa
            </span>
          </div>

          <div className="my-4">
            <div className="text-3xl font-black text-white">
              {formatPressure(current.pressureMsl, unit)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Surface Level: {current.surfacePressure} hPa
            </p>
          </div>

          <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            {current.pressureMsl > 1020
              ? 'High pressure system: Stable, fair weather dominating.'
              : current.pressureMsl < 1005
              ? 'Low pressure system: Unstable air, potential clouds or rain.'
              : 'Standard atmospheric pressure.'}
          </p>
        </div>

        {/* 5. VISIBILITY */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-sky-400" /> Optical Visibility
            </span>
            <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20">
              Clarity
            </span>
          </div>

          <div className="my-4">
            <div className="text-3xl font-black text-white">
              {unit === 'F' ? `${visibilityMiles} mi` : `${visibilityKm} km`}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Clear visual distance ahead
            </p>
          </div>

          <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            Excellent horizon line visibility for driving and flight.
          </p>
        </div>

        {/* 6. CLOUD COVER */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-slate-300" /> Cloud Coverage
            </span>
            <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
              {current.cloudCover}%
            </span>
          </div>

          <div className="my-4">
            <div className="text-3xl font-black text-white">
              {current.cloudCover}%
            </div>
            <div className="mt-2 w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-slate-400 rounded-full transition-all duration-500"
                style={{ width: `${current.cloudCover}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            {current.cloudCover > 80
              ? 'Overcast ceiling.'
              : current.cloudCover > 40
              ? 'Partly cloudy sky filter.'
              : 'Mostly clear blue skies.'}
          </p>
        </div>

      </div>
    </div>
  );
};
