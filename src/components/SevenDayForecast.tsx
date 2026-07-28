import React, { useState } from 'react';
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  CloudRain,
  Sun,
  Wind,
  Sunrise,
  Sunset,
  Umbrella,
  Thermometer,
} from 'lucide-react';
import { DailyForecastItem, TemperatureUnit } from '../types';
import { getWeatherCodeInfo } from '../utils/weatherCodes';
import {
  formatTemperature,
  formatWindSpeed,
  formatPrecipitation,
  getWindDirectionCardinal,
  getUvCategory,
} from '../utils/unitConverters';

interface SevenDayForecastProps {
  daily: DailyForecastItem[];
  unit: TemperatureUnit;
}

export const SevenDayForecast: React.FC<SevenDayForecastProps> = ({ daily, unit }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Compute overall min and max across 7 days to scale temperature range bar
  const globalMin = Math.min(...daily.map((d) => d.tempMin));
  const globalMax = Math.max(...daily.map((d) => d.tempMax));
  const rangeSpan = Math.max(1, globalMax - globalMin);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div id="7day-forecast-section" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-sky-400" /> 7-Day Extended Outlook
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Weekly outlook with thermal range bars and daily detail breakdown
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {daily.map((day, index) => {
          const isToday = index === 0;
          const dateObj = new Date(day.date + 'T00:00:00');
          const dayName = isToday
            ? 'Today'
            : dateObj.toLocaleDateString([], { weekday: 'short' });
          const dateFormatted = dateObj.toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
          });

          const weatherInfo = getWeatherCodeInfo(day.weatherCode);
          const isExpanded = expandedIndex === index;
          const uvCat = getUvCategory(day.uvIndexMax);

          // Calculate percentage width and offsets for temperature bar
          const leftPercent = Math.max(0, ((day.tempMin - globalMin) / rangeSpan) * 100);
          const widthPercent = Math.max(8, ((day.tempMax - day.tempMin) / rangeSpan) * 100);

          const sunriseStr = day.sunrise
            ? new Date(day.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'N/A';
          const sunsetStr = day.sunset
            ? new Date(day.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'N/A';

          return (
            <div
              key={day.date}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isToday
                  ? 'bg-slate-950/80 border-sky-500/40 shadow-lg shadow-sky-500/5'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Main Summary Row */}
              <div
                onClick={() => toggleExpand(index)}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none group"
              >
                {/* Day & Condition */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className="w-16 shrink-0">
                    <div className="text-sm font-bold text-white flex items-center gap-1">
                      {dayName}
                      {isToday && (
                        <span className="w-2 h-2 rounded-full bg-sky-400 inline-block animate-pulse"></span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">{dateFormatted}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-800/80 text-sky-300 text-xs shrink-0">
                      <span className="font-semibold text-xs capitalize truncate max-w-[100px] block">
                        {weatherInfo.description}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rain Probability Badge */}
                <div className="flex items-center gap-2 shrink-0">
                  <div
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      day.precipitationProbabilityMax > 40
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <CloudRain className="w-3.5 h-3.5" />
                    <span>{day.precipitationProbabilityMax}%</span>
                  </div>
                </div>

                {/* Relative Temp Range Bar & Min/Max */}
                <div className="flex-1 max-w-xs flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-400 w-10 text-right">
                    {formatTemperature(day.tempMin, unit)}
                  </span>

                  <div className="flex-1 h-2 bg-slate-800 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-mono font-bold text-white w-10">
                    {formatTemperature(day.tempMax, unit)}
                  </span>
                </div>

                {/* Expand Toggle Chevron */}
                <button
                  className="p-1 rounded-lg bg-slate-800/60 text-slate-400 group-hover:text-white transition shrink-0"
                  title="Toggle day details"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Expandable Details Accordion */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 bg-slate-900/60 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in duration-200 text-xs">
                  
                  {/* Sunrise & Sunset */}
                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Sunrise className="w-3.5 h-3.5 text-amber-400" /> Sunrise / Sunset
                    </span>
                    <div className="font-bold text-white">
                      {sunriseStr} / {sunsetStr}
                    </div>
                  </div>

                  {/* Total Precipitation Sum */}
                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Umbrella className="w-3.5 h-3.5 text-blue-400" /> Total Rain / Snow
                    </span>
                    <div className="font-bold text-white">
                      {formatPrecipitation(day.precipitationSum, unit)}
                    </div>
                  </div>

                  {/* Wind Gusts & Direction */}
                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5 text-emerald-400" /> Max Wind Gusts
                    </span>
                    <div className="font-bold text-white">
                      {formatWindSpeed(day.windGustsMax, unit)} ({getWindDirectionCardinal(day.windDirectionDominant)})
                    </div>
                  </div>

                  {/* Peak UV Index */}
                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-amber-400" /> Max Solar UV Index
                    </span>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{day.uvIndexMax}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${uvCat.badge}`}>
                        {uvCat.label}
                      </span>
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
