import React from 'react';
import { X, Sparkles, ArrowRight, BookOpen, CheckCircle2, Award } from 'lucide-react';
import { INITIAL_MISSIONS } from '../../utils/constants.js';
import { playClickSound } from '../../audio/soundFx.js';

export function SDGDetailModal({ sdg, onClose, onStartMission }) {
  if (!sdg) return null;

  // Find missions for this SDG
  const availableMissions = INITIAL_MISSIONS.filter(m => m.sdgId === sdg.id || m.sdgNumber === sdg.number);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border-4 border-slate-100 my-auto animate-float">
        {/* Colorful Header Banner */}
        <div className={`p-6 text-white ${sdg.bgColor} relative overflow-hidden`}>
          <button
            onClick={() => { playClickSound(); onClose(); }}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-5xl shadow-inner">
              {sdg.icon}
            </div>
            <div>
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full border border-white/30">
                SDG {sdg.number}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {sdg.childTitle}
              </h2>
              <p className="text-white/80 text-xs font-bold">{sdg.title}</p>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Storybook Explanation */}
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm mb-1.5">
              <span>📖</span>
              <span>The Story of SDG {sdg.number}</span>
            </div>
            <p className="text-amber-950 font-handwriting text-lg leading-snug">
              "{sdg.story}"
            </p>
          </div>

          {/* Missions list */}
          <div>
            <h3 className="font-black text-slate-900 text-lg mb-3 flex items-center gap-2">
              <span>🎯</span>
              <span>Real-World Challenges ({availableMissions.length || 1})</span>
            </h3>

            <div className="space-y-3">
              {availableMissions.length > 0 ? (
                availableMissions.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-slate-900 text-base">{m.title}</span>
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-200">
                          +{m.xpReward} XP ⭐
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">{m.challengeText}</p>
                    </div>

                    <button
                      onClick={() => {
                        playClickSound();
                        onClose();
                        onStartMission(m);
                      }}
                      className="btn-pop w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-black px-5 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-1.5 text-xs whitespace-nowrap"
                    >
                      <span>ACCEPT MISSION</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm">Become an Earth Pioneer! 🌿</div>
                    <p className="text-xs text-sky-700">Complete daily eco habits to unlock new pages for SDG {sdg.number}.</p>
                  </div>
                  <button
                    onClick={() => {
                      playClickSound();
                      onClose();
                      onStartMission(INITIAL_MISSIONS[0]);
                    }}
                    className="btn-pop bg-sky-600 text-white font-black px-4 py-2 rounded-xl text-xs"
                  >
                    Start Mission →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
