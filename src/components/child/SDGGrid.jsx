import React, { useState } from 'react';
import { Search, Filter, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { SDGS_DATA } from '../../utils/constants.js';
import { playClickSound } from '../../audio/soundFx.js';

export function SDGGrid({ sdgs = SDGS_DATA, onSelectSdg }) {
  const [filter, setFilter] = useState('all'); // 'all', 'core', 'completed'
  const [search, setSearch] = useState('');

  const coreIds = [3, 6, 12, 13, 15]; // The 5 MVP focus SDGs requested

  const filteredSdgs = sdgs.filter(sdg => {
    const matchesSearch = sdg.title.toLowerCase().includes(search.toLowerCase()) || 
                          sdg.childTitle.toLowerCase().includes(search.toLowerCase()) ||
                          sdg.description.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filter === 'core') return coreIds.includes(sdg.id);
    if (filter === 'completed') return sdg.completedMissions > 0;
    return true;
  });

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 pt-4">
      {/* Title & Pitch */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-300">
          ✨ 17 Earth Missions
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Explore the Sustainable Goals
        </h1>
        <p className="text-slate-600 text-sm font-medium max-w-xl mx-auto">
          Choose an SDG card below to read its adventure story and complete real-world missions!
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search SDGs (e.g. Water, Trees)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 border border-slate-200"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => { playClickSound(); setFilter('all'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-slate-900 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All 17 SDGs 🌎
          </button>
          <button
            onClick={() => { playClickSound(); setFilter('core'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'core'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            ⭐ Focus 5 SDGs
          </button>
          <button
            onClick={() => { playClickSound(); setFilter('completed'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'completed'
                ? 'bg-amber-500 text-white shadow'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            ✅ In Progress
          </button>
        </div>
      </div>

      {/* Grid of SDG Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSdgs.map((sdg) => {
          const isCore = coreIds.includes(sdg.id);
          const progressPercent = Math.round((sdg.completedMissions / sdg.totalMissions) * 100);

          return (
            <div
              key={sdg.id}
              onClick={() => { playClickSound(); onSelectSdg(sdg); }}
              className={`btn-pop relative cursor-pointer rounded-3xl p-5 border-2 shadow-md hover:shadow-xl transition-all ${sdg.lightBg} ${sdg.borderColor} flex flex-col justify-between overflow-hidden group`}
            >
              {/* Core Badge */}
              {isCore && (
                <span className="absolute top-3 right-3 bg-amber-400 text-amber-950 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow border border-amber-200">
                  MVP FOCUS ⭐
                </span>
              )}

              <div>
                {/* Header icon + SDG number */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-14 h-14 rounded-2xl text-3xl flex items-center justify-center text-white font-black shadow-md ${sdg.bgColor} group-hover:scale-110 transition-transform`}
                  >
                    {sdg.icon}
                  </div>
                  <div>
                    <div className="text-[11px] font-extrabold text-slate-500 tracking-wider uppercase">
                      SDG {sdg.number}
                    </div>
                    <div className="font-black text-lg text-slate-900 leading-tight">
                      {sdg.childTitle}
                    </div>
                  </div>
                </div>

                <p className="text-xs font-medium text-slate-600 line-clamp-2 mb-4">
                  "{sdg.description}"
                </p>
              </div>

              {/* Progress Footer */}
              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${sdg.bgColor} transition-all duration-300`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="font-bold text-slate-700">
                    {sdg.completedMissions} / {sdg.totalMissions}
                  </span>
                </div>

                <span className="font-black text-emerald-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  View →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
