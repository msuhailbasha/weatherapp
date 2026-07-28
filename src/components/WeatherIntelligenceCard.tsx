import React, { useState } from 'react';
import {
  Sparkles,
  Shirt,
  Activity,
  Car,
  HeartPulse,
  Home,
  Utensils,
  CheckCircle2,
  AlertTriangle,
  Umbrella,
  Glasses,
  Clock,
  ThumbsUp,
  XCircle,
  Wind,
  Droplets,
  Sun,
  Zap,
} from 'lucide-react';
import { IntelligenceInsights } from '../types';

interface WeatherIntelligenceCardProps {
  insights: IntelligenceInsights;
}

type TabType = 'outfit' | 'activity' | 'travel' | 'health' | 'home' | 'events';

export const WeatherIntelligenceCard: React.FC<WeatherIntelligenceCardProps> = ({ insights }) => {
  const [activeTab, setActiveTab] = useState<TabType>('outfit');

  const {
    overallSummary,
    comfortScore,
    outfitAdvice,
    outdoorActivity,
    commuteTravel,
    healthUV,
    homeGarden,
    eventOutdoor,
  } = insights;

  // Comfort score color
  const comfortColor =
    comfortScore >= 80
      ? 'from-emerald-500 to-teal-400 text-emerald-400'
      : comfortScore >= 60
      ? 'from-sky-500 to-blue-400 text-sky-400'
      : comfortScore >= 40
      ? 'from-amber-500 to-orange-400 text-amber-400'
      : 'from-rose-500 to-red-600 text-rose-400';

  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'outfit', label: 'Outfit & Style', icon: Shirt },
    { id: 'activity', label: 'Sports & Fitness', icon: Activity },
    { id: 'travel', label: 'Commute & Travel', icon: Car },
    { id: 'health', label: 'Health & UV', icon: HeartPulse },
    { id: 'home', label: 'Home & Garden', icon: Home },
    { id: 'events', label: 'Events & Dining', icon: Utensils },
  ];

  return (
    <div id="weather-intelligence-section" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500/20 via-blue-500/20 to-indigo-500/20 border border-sky-500/30 text-sky-400">
              <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Weather Intelligence Advisory
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400">
                AI Synthesis
              </span>
            </h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            {overallSummary}
          </p>
        </div>

        {/* Comfort Index Meter */}
        <div className="flex items-center gap-4 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 shrink-0">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`transition-all duration-1000 ${
                  comfortScore >= 80
                    ? 'text-emerald-500'
                    : comfortScore >= 60
                    ? 'text-sky-500'
                    : comfortScore >= 40
                    ? 'text-amber-500'
                    : 'text-rose-500'
                }`}
                strokeDasharray={`${comfortScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className={`absolute text-sm font-black ${comfortColor}`}>
              {comfortScore}
            </span>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Comfort Index
            </div>
            <div className="text-sm font-bold text-white">
              {comfortScore >= 80
                ? 'Highly Comfortable'
                : comfortScore >= 60
                ? 'Pleasant & Mild'
                : comfortScore >= 40
                ? 'Moderate Stress'
                : 'Uncomfortable'}
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-slate-800/60">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 ring-1 ring-sky-400'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="mt-6">
        
        {/* 1. OUTFIT TAB */}
        {activeTab === 'outfit' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
            <div className="md:col-span-2 space-y-4">
              <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-base font-bold text-sky-400 flex items-center gap-2">
                    <Shirt className="w-5 h-5 text-sky-400" /> {outfitAdvice.title}
                  </h4>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-300 border border-sky-500/20">
                    {outfitAdvice.layersLevel} Layering
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {outfitAdvice.description}
                </p>
              </div>

              <div>
                <h5 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">
                  Recommended Clothing Items
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {outfitAdvice.recommendedItems.map((item, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Side Weather Gear Callouts */}
            <div className="space-y-3">
              <div className={`p-4 rounded-2xl border flex items-center gap-3 ${outfitAdvice.umbrellaNeeded ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-slate-800/40 border-slate-800 text-slate-400'}`}>
                <Umbrella className="w-6 h-6 shrink-0" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide">Umbrella Status</div>
                  <div className="text-sm font-semibold text-white">
                    {outfitAdvice.umbrellaNeeded ? 'Carry an umbrella!' : 'No umbrella required'}
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border flex items-center gap-3 ${outfitAdvice.sunglassesNeeded ? 'bg-sky-500/10 border-sky-500/30 text-sky-300' : 'bg-slate-800/40 border-slate-800 text-slate-400'}`}>
                <Glasses className="w-6 h-6 shrink-0" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide">Sun Protection</div>
                  <div className="text-sm font-semibold text-white">
                    {outfitAdvice.sunglassesNeeded ? 'Wear UV sunglasses & SPF' : 'Minimal sun glare'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. ACTIVITY TAB */}
        {activeTab === 'activity' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
            <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Outdoor Exercise Rating
                </div>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-4xl font-extrabold text-white">
                    {outdoorActivity.score}
                    <span className="text-lg text-slate-500 font-medium">/100</span>
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    outdoorActivity.verdict === 'Ideal'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : outdoorActivity.verdict === 'Good'
                      ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  }`}>
                    {outdoorActivity.verdict}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-400 mb-1">
                  <Clock className="w-4 h-4" /> Optimal Time Window
                </div>
                <p className="text-sm font-semibold text-white">
                  {outdoorActivity.bestTimeWindow}
                </p>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/40 p-4 rounded-xl border border-slate-800">
                {outdoorActivity.advice}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/20">
                  <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ThumbsUp className="w-3.5 h-3.5" /> Recommended Activities
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {outdoorActivity.suitableActivities.map((act, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {act}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-500/5 p-4 rounded-2xl border border-rose-500/20">
                  <h5 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5" /> Avoid or Exercise Caution
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {outdoorActivity.unsuitableActivities.map((act, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                        {act}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. TRAVEL & COMMUTE TAB */}
        {activeTab === 'travel' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className={`p-5 rounded-2xl border flex items-start gap-4 ${
              commuteTravel.hazardLevel === 'Severe' || commuteTravel.hazardLevel === 'High'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : commuteTravel.hazardLevel === 'Moderate'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}>
              <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider">
                  Commute Hazard Level: {commuteTravel.hazardLevel}
                </div>
                <p className="text-sm font-medium text-white mt-1">
                  {commuteTravel.commuteAdvice}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Road Traction & Surface Status
                </div>
                <div className="text-sm font-semibold text-slate-200">
                  {commuteTravel.roadConditions}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Optical Visibility Range
                </div>
                <div className="text-sm font-semibold text-slate-200">
                  {commuteTravel.visibilityStatus}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. HEALTH & UV TAB */}
        {activeTab === 'health' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
            <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-400" /> UV Risk Exposure
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {healthUV.uvRisk}
                </span>
              </div>
              <p className="text-sm text-slate-300">
                {healthUV.burnTimeMinutes
                  ? `Unprotected skin burn time is estimated at ~${healthUV.burnTimeMinutes} minutes during solar noon.`
                  : 'Minimal UV burn danger today.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-rose-400" /> Air Quality & Respiratory
              </div>
              <p className="text-sm text-slate-300">
                {healthUV.airQualityImpact}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-purple-400" /> Barometric Pressure & Joints
              </div>
              <p className="text-sm text-slate-300">
                {healthUV.jointSensitivityNotice}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-sky-400" /> Daily Hydration Goal
              </div>
              <p className="text-sm text-slate-300">
                {healthUV.hydrationAdvice}
              </p>
            </div>
          </div>
        )}

        {/* 5. HOME & GARDEN TAB */}
        {activeTab === 'home' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`p-4 rounded-2xl border ${homeGarden.gardenWateringNeeded ? 'bg-sky-500/10 border-sky-500/30 text-sky-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'}`}>
                <div className="text-xs font-bold uppercase tracking-wider mb-1">
                  Lawn & Garden Irrigation
                </div>
                <div className="text-sm font-semibold text-white">
                  {homeGarden.advice}
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${homeGarden.windowDryingFeasible ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'}`}>
                <div className="text-xs font-bold uppercase tracking-wider mb-1">
                  Outdoor Clothes Drying
                </div>
                <div className="text-sm font-semibold text-white">
                  {homeGarden.windowDryingFeasible ? 'Excellent conditions for air-drying laundry outside.' : 'High humidity or rain risk; indoor drying recommended.'}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">HVAC & Energy Conservation Tip</div>
                <div className="text-sm text-slate-200 mt-0.5">{homeGarden.energyEfficiencyTip}</div>
              </div>
            </div>
          </div>
        )}

        {/* 6. EVENTS & DINING TAB */}
        {activeTab === 'events' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className={`p-5 rounded-2xl border ${
              eventOutdoor.outdoorFeasibility === 'Highly Recommended'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : eventOutdoor.outdoorFeasibility === 'Feasible with Precautions'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              <div className="text-xs font-bold uppercase tracking-wider">
                Outdoor Event Feasibility: {eventOutdoor.outdoorFeasibility}
              </div>
              <p className="text-sm font-semibold text-white mt-1">
                {eventOutdoor.advice}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Evening Outdoor Comfort Index
              </div>
              <div className="text-sm font-semibold text-slate-200">
                {eventOutdoor.eveningComfort}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
