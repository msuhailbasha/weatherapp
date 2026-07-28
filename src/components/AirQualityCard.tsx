import React from 'react';
import { Gauge, ShieldAlert, Heart, Activity, Wind, Sparkles } from 'lucide-react';
import { AirQualityData } from '../types';
import { getAqiCategory } from '../utils/unitConverters';

interface AirQualityCardProps {
  airQuality: AirQualityData | null;
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({ airQuality }) => {
  if (!airQuality) {
    return null;
  }

  const { usAqi, pm2_5, pm10, ozone, nitrogenDioxide, carbonMonoxide, sulphurDioxide } = airQuality;
  const aqiInfo = getAqiCategory(usAqi);

  const pollutants = [
    { name: 'PM2.5', value: pm2_5.toFixed(1), unit: 'µg/m³', max: 50, label: 'Fine Particulates' },
    { name: 'PM10', value: pm10.toFixed(1), unit: 'µg/m³', max: 100, label: 'Coarse Dust' },
    { name: 'O3', value: ozone.toFixed(1), unit: 'µg/m³', max: 180, label: 'Ozone' },
    { name: 'NO2', value: nitrogenDioxide.toFixed(1), unit: 'µg/m³', max: 200, label: 'Nitrogen Dioxide' },
    { name: 'CO', value: (carbonMonoxide / 1000).toFixed(2), unit: 'mg/m³', max: 10, label: 'Carbon Monoxide' },
    { name: 'SO2', value: sulphurDioxide.toFixed(1), unit: 'µg/m³', max: 350, label: 'Sulphur Dioxide' },
  ];

  return (
    <div id="air-quality-section" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Gauge className="w-5 h-5 text-emerald-400" /> Air Quality Index (US AQI)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real-time atmospheric composition and pollution concentrations
          </p>
        </div>

        <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2 text-xs font-bold ${aqiInfo.bg} ${aqiInfo.text}`}>
          <Activity className="w-4 h-4" />
          <span>AQI {usAqi} — {aqiInfo.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        
        {/* Left Column: AQI Dial & Advice */}
        <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col items-center text-center">
          <div className="relative w-36 h-36 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                stroke={aqiInfo.color}
                strokeDasharray={`${Math.min(100, (usAqi / 300) * 100)}, 100`}
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-white">{usAqi}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">US AQI</span>
            </div>
          </div>

          <div className="mt-3">
            <div className={`text-sm font-bold ${aqiInfo.text}`}>
              {aqiInfo.label}
            </div>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              {aqiInfo.advice}
            </p>
          </div>
        </div>

        {/* Right Column: Pollutants Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {pollutants.map((p) => {
            const ratio = Math.min(100, (parseFloat(p.value) / p.max) * 100);
            return (
              <div key={p.name} className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{p.name}</span>
                  <span className="text-[10px] text-slate-400">{p.label}</span>
                </div>

                <div className="text-lg font-black text-slate-200">
                  {p.value} <span className="text-[10px] text-slate-500 font-normal">{p.unit}</span>
                </div>

                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(5, ratio)}%`,
                      backgroundColor: aqiInfo.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
