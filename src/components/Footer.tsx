import React from 'react';
import { Sparkles, Globe, Cloud, Heart, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">Weather Intelligence App</div>
            <p className="text-slate-500 text-[11px]">
              Next-generation meteorology & planning insights engine
            </p>
          </div>
        </div>

        {/* Open-Meteo Attribution & Cloudflare Pages note */}
        <div className="text-center md:text-right space-y-1">
          <div className="flex items-center justify-center md:justify-end gap-1.5 text-slate-300 font-medium">
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span>Public REST Data by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">Open-Meteo</a></span>
          </div>
          <p className="text-slate-500 text-[11px]">
            100% Client-Side Static Single Page Application • Deployable on GitHub & Cloudflare Pages
          </p>
        </div>

      </div>
    </footer>
  );
};
