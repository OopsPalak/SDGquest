import React, { useState } from 'react';
import { Award, Lock, Sparkles, CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import { BADGES } from '../../utils/constants.js';
import { CollectibleBadge, EmptyBadgesIllustration } from '../common/SdgArtwork.jsx';
import { playClickSound } from '../../audio/soundFx.js';

export function BadgesView({ unlockedBadgeIds = [], onNavigateToMissions }) {
  const [selectedBadge, setSelectedBadge] = useState(null);

  const totalUnlocked = unlockedBadgeIds.length;

  return (
    <div className="space-y-6 pb-28 max-w-4xl mx-auto px-4 pt-4">
      {/* Title */}
      <div className="text-center space-y-1">
        <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-black uppercase px-3 py-1 rounded-full border border-amber-300">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>COLLECTIBLE TROPHIES</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Badges & Achievements
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto">
          Earn illustrated medallions by completing real-world missions across all 17 Sustainable Goals!
        </p>
      </div>

      {/* Stats Summary Bar */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-5 text-amber-950 shadow-md border-2 border-amber-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 shadow">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="text-[11px] font-black uppercase text-amber-900">Total Unlocked</div>
            <div className="font-black text-2xl text-amber-950">
              {totalUnlocked} of {BADGES.length} Badges
            </div>
          </div>
        </div>

        <div className="text-xs font-black bg-amber-950/20 text-amber-950 px-3.5 py-1.5 rounded-full border border-amber-900/30">
          {Math.round((totalUnlocked / BADGES.length) * 100)}% Complete
        </div>
      </div>

      {/* Empty State if 0 Badges Unlocked */}
      {totalUnlocked === 0 && (
        <div className="bg-white/95 rounded-3xl p-8 sm:p-10 border-2 border-slate-200 text-center shadow-lg space-y-4">
          <EmptyBadgesIllustration />
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900">Your First Badge Is Waiting!</h3>
            <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto">
              Complete your first real-world mission like saving water or sorting recyclables to place your first gold trophy on the shelf!
            </p>
          </div>

          <button
            onClick={() => {
              playClickSound();
              if (onNavigateToMissions) onNavigateToMissions();
            }}
            className="btn-pop bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-3 rounded-2xl shadow text-xs inline-flex items-center gap-2"
          >
            <span>START A MISSION →</span>
          </button>
        </div>
      )}

      {/* Badges Collectible Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {BADGES.map((b) => {
          const isUnlocked = unlockedBadgeIds.includes(b.id);

          return (
            <div
              key={b.id}
              onClick={() => { playClickSound(); setSelectedBadge(b); }}
              className={`btn-pop relative cursor-pointer p-4 rounded-3xl border-2 flex flex-col items-center text-center justify-between transition-all ${
                isUnlocked
                  ? 'bg-white border-amber-300 shadow-md hover:shadow-xl hover:border-amber-400'
                  : 'bg-slate-50 border-slate-200 text-slate-400 opacity-70 hover:opacity-100'
              }`}
            >
              {/* Illustrated Collectible Medallion */}
              <div className="my-2 relative flex items-center justify-center">
                <CollectibleBadge badgeId={b.id} unlocked={isUnlocked} size="lg" />

                {isUnlocked && (
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 p-1 rounded-full text-xs shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider block text-slate-400">
                  {b.category}
                </span>
                <h3 className="font-black text-sm text-slate-900 leading-tight">
                  {b.name}
                </h3>
              </div>

              <div className="mt-3">
                {isUnlocked ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
                    UNLOCKED ✨
                  </span>
                ) : (
                  <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>LOCKED</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge Inspect Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border-4 border-slate-100 animate-float">
            
            <div className="flex justify-center my-2">
              <CollectibleBadge
                badgeId={selectedBadge.id}
                unlocked={unlockedBadgeIds.includes(selectedBadge.id)}
                size="xl"
              />
            </div>

            <div>
              <span className="text-xs font-black uppercase text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                {selectedBadge.category}
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">{selectedBadge.name}</h2>
              <p className="text-xs text-slate-600 font-medium mt-1">"{selectedBadge.desc}"</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
              {unlockedBadgeIds.includes(selectedBadge.id) ? (
                <span className="text-emerald-700 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Collected in your trophy shelf!</span>
                </span>
              ) : (
                <span className="text-slate-500 flex items-center justify-center gap-1">
                  <Lock className="w-4 h-4" />
                  <span>Complete this goal's real-world mission to unlock!</span>
                </span>
              )}
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
