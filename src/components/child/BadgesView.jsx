import React, { useState } from 'react';
import { Award, Lock, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { BADGES } from '../../utils/constants.js';
import { playClickSound } from '../../audio/soundFx.js';

export function BadgesView({ unlockedBadgeIds = [] }) {
  const [selectedBadge, setSelectedBadge] = useState(null);

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* Title */}
      <div className="text-center space-y-1">
        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-xs font-black uppercase px-3 py-1 rounded-full border border-amber-300">
          🏅 Eco Trophies
        </span>
        <h1 className="text-3xl font-black text-slate-900">
          Badges & Achievements
        </h1>
        <p className="text-xs text-slate-600 font-medium">
          Earn badges by completing real-world missions across all 17 Sustainable Goals!
        </p>
      </div>

      {/* Stats summary */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-5 text-amber-950 shadow-md border-2 border-amber-300 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl shadow">
            🏆
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-amber-900">Total Unlocked</div>
            <div className="font-black text-2xl text-amber-950">
              {unlockedBadgeIds.length} / {BADGES.length} Badges
            </div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {BADGES.map((b) => {
          const isUnlocked = unlockedBadgeIds.includes(b.id);

          return (
            <div
              key={b.id}
              onClick={() => { playClickSound(); setSelectedBadge(b); }}
              className={`btn-pop relative cursor-pointer p-4 rounded-3xl border-2 flex flex-col items-center text-center justify-between transition-all ${
                isUnlocked
                  ? `${b.bg} shadow-md hover:shadow-xl scale-100`
                  : 'bg-slate-100 border-slate-200 text-slate-400 opacity-70 hover:opacity-100'
              }`}
            >
              {/* Top Badge Icon */}
              <div className="relative my-2">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-inner border-4 ${
                  isUnlocked ? 'bg-white border-amber-300' : 'bg-slate-200 border-slate-300'
                }`}>
                  {isUnlocked ? b.icon : '🔒'}
                </div>

                {isUnlocked && (
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 p-1 rounded-full text-xs shadow">
                    ✨
                  </span>
                )}
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider block opacity-75 mb-0.5">
                  {b.category}
                </span>
                <h3 className="font-black text-sm text-slate-900 leading-tight">
                  {b.name}
                </h3>
              </div>

              <div className="mt-3">
                {isUnlocked ? (
                  <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow">
                    UNLOCKED 🎉
                  </span>
                ) : (
                  <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    LOCKED 🔒
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border-4 border-slate-100 animate-float">
            <div className="w-24 h-24 rounded-full bg-amber-100 border-4 border-amber-300 flex items-center justify-center text-6xl mx-auto shadow-inner">
              {selectedBadge.icon}
            </div>

            <div>
              <span className="text-xs font-black uppercase text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                {selectedBadge.category}
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">{selectedBadge.name}</h2>
              <p className="text-xs text-slate-600 font-medium mt-1">"{selectedBadge.desc}"</p>
            </div>

            <button
              onClick={() => { playClickSound(); setSelectedBadge(null); }}
              className="btn-pop w-full bg-slate-900 text-white font-black py-3 rounded-2xl shadow text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
