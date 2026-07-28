import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  Thermometer,
  CloudRain,
  Wind,
  Sun,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { HourlyForecastItem, TemperatureUnit } from '../types';
import { getWeatherCodeInfo } from '../utils/weatherCodes';
import {
  formatTempVal,
  formatWindSpeed,
  formatPrecipitation,
} from '../utils/unitConverters';

interface HourlyForecastChartProps {
  hourly: HourlyForecastItem[];
  unit: TemperatureUnit;
}

type MetricType = 'temp' | 'precip' | 'wind' | 'uv';

export const HourlyForecastChart: React.FC<HourlyForecastChartProps> = ({
  hourly,
  unit,
}) => {
  const [metric, setMetric] = useState<MetricType>('temp');
  const [hoveredHour, setHoveredHour] = useState<HourlyForecastItem | null>(null);

  // Take next 24 items for clean chart
  const items24 = hourly.slice(0, 24);

  const chartData = items24.map((item) => {
    const timeObj = new Date(item.time);
    const timeLabel = timeObj.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return {
      time: timeLabel,
      temp: formatTempVal(item.temperature, unit),
      precip: item.precipitationProbability,
      wind: Math.round(unit === 'F' ? item.windSpeed * 0.621371 : item.windSpeed),
      uv: item.uvIndex,
      weatherCode: item.weatherCode,
      rawItem: item,
    };
  });

  const getMetricDetails = () => {
    switch (metric) {
      case 'temp':
        return {
          label: `Temperature (${unit === 'F' ? '°F' : '°C'})`,
          key: 'temp',
          color: '#38bdf8', // sky-400
          gradientStart: '#38bdf8',
          gradientEnd: '#0284c7',
          unitStr: unit === 'F' ? '°F' : '°C',
        };
      case 'precip':
        return {
          label: 'Precipitation Probability (%)',
          key: 'precip',
          color: '#60a5fa', // blue-400
          gradientStart: '#60a5fa',
          gradientEnd: '#1d4ed8',
          unitStr: '%',
        };
      case 'wind':
        return {
          label: `Wind Speed (${unit === 'F' ? 'mph' : 'km/h'})`,
          key: 'wind',
          color: '#34d399', // emerald-400
          gradientStart: '#34d399',
          gradientEnd: '#047857',
          unitStr: unit === 'F' ? 'mph' : 'km/h',
        };
      case 'uv':
        return {
          label: 'UV Index',
          key: 'uv',
          color: '#fbbf24', // amber-400
          gradientStart: '#fbbf24',
          gradientEnd: '#d97706',
          unitStr: '',
        };
    }
  };

  const activeDetails = getMetricDetails();

  return (
    <div id="hourly-forecast-section" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      
      {/* Header & Metric Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-400" /> Hourly Forecast & Trends
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            24-hour meteorological projection powered by Open-Meteo high-resolution model
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setMetric('temp')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              metric === 'temp'
                ? 'bg-sky-500 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" /> Temp
          </button>

          <button
            onClick={() => setMetric('precip')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              metric === 'precip'
                ? 'bg-blue-500 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" /> Rain %
          </button>

          <button
            onClick={() => setMetric('wind')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              metric === 'wind'
                ? 'bg-emerald-500 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5" /> Wind
          </button>

          <button
            onClick={() => setMetric('uv')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              metric === 'uv'
                ? 'bg-amber-500 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> UV
          </button>
        </div>
      </div>

      {/* Interactive Recharts Graph */}
      <div className="w-full h-64 sm:h-72 my-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={activeDetails.gradientStart} stopOpacity={0.4} />
                <stop offset="95%" stopColor={activeDetails.gradientEnd} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const item: HourlyForecastItem = data.rawItem;
                  const info = getWeatherCodeInfo(item.weatherCode);

                  return (
                    <div className="bg-slate-950 border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs space-y-1 z-50">
                      <div className="font-bold text-sky-400 border-b border-slate-800 pb-1">
                        {data.time}
                      </div>
                      <div className="text-white font-medium capitalize">
                        {info.description}
                      </div>
                      <div className="text-slate-300 font-mono font-bold">
                        {activeDetails.label.split(' ')[0]}: {payload[0].value} {activeDetails.unitStr}
                      </div>
                      <div className="text-slate-400 text-[10px]">
                        Rain Prob: {item.precipitationProbability}% • Humidity: {item.relativeHumidity}%
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey={activeDetails.key}
              stroke={activeDetails.color}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#metricGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Horizontal Hourly Cards Slider */}
      <div className="mt-6 pt-6 border-t border-slate-800">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Hourly Timeline Breakdown
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 no-scrollbar snap-x">
          {items24.map((item, index) => {
            const timeObj = new Date(item.time);
            const isNow = index === 0;
            const hourStr = isNow
              ? 'Now'
              : timeObj.toLocaleTimeString([], { hour: 'numeric', hour12: true });

            const info = getWeatherCodeInfo(item.weatherCode);

            return (
              <div
                key={index}
                className={`snap-start px-3 py-3.5 rounded-2xl border transition-all flex flex-col items-center justify-between min-w-[85px] shrink-0 text-center ${
                  isNow
                    ? 'bg-sky-500/20 border-sky-500/50 text-white shadow-lg shadow-sky-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <span className="text-xs font-bold text-slate-400">
                  {hourStr}
                </span>

                <div className="my-2 p-2 rounded-xl bg-slate-800/60 text-sky-300 text-xs">
                  <span className="font-semibold text-xs block capitalize truncate max-w-[65px]">
                    {info.description}
                  </span>
                </div>

                <div className="text-base font-black text-white">
                  {formatTempVal(item.temperature, unit)}°
                </div>

                <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded-full">
                  <CloudRain className="w-3 h-3" />
                  <span>{item.precipitationProbability}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
