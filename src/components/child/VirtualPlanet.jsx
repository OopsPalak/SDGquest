import React from 'react';
import { Sparkles, Trees, Sun, Cloud, Droplet, Flame } from 'lucide-react';
import { LEVELS } from '../../utils/constants.js';

export function VirtualPlanet({ xp = 210, level = 2, levelName = 'Earth Friend' }) {
  // Determine planet stage
  const currentLevelInfo = LEVELS.find(l => l.level === level) || LEVELS[0];
  const nextLevelInfo = LEVELS.find(l => l.level === level + 1);

  let progressPercent = 100;
  if (nextLevelInfo) {
    const min = currentLevelInfo.minXp;
    const max = nextLevelInfo.minXp;
    progressPercent = Math.min(100, Math.max(0, Math.round(((xp - min) / (max - min)) * 100)));
  }

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-400 p-6 text-white shadow-xl border-4 border-white">
      {/* Background Sun & Clouds */}
      <div className="absolute top-4 right-6 text-amber-300 animate-pulse-glow">
        <Sun className="w-12 h-12 fill-amber-300 text-amber-400" />
      </div>

      <div className="absolute top-6 left-8 text-white/80 animate-float">
        <Cloud className="w-10 h-10 fill-white/80" />
      </div>
      <div className="absolute top-12 right-24 text-white/60 animate-float" style={{ animationDelay: '1.5s' }}>
        <Cloud className="w-7 h-7 fill-white/60" />
      </div>

      {/* Header Level Pill */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/40 flex items-center gap-2">
          <span className="text-2xl">{currentLevelInfo.icon}</span>
          <div>
            <div className="text-[10px] font-bold text-sky-100 uppercase tracking-wider">Level {level}</div>
            <div className="font-black text-sm text-white tracking-tight">{levelName}</div>
          </div>
        </div>

        <div className="bg-amber-400/90 text-amber-950 px-3 py-1 rounded-full font-black text-xs shadow-md border border-amber-200 flex items-center gap-1">
          <span>⭐</span>
          <span>{xp} XP</span>
        </div>
      </div>

      {/* Main Interactive Planet Scene */}
      <div className="relative z-10 h-44 my-2 flex flex-col items-center justify-center text-center">
        {/* Stage 1: Seed */}
        {level === 1 && (
          <div className="flex flex-col items-center animate-bounce">
            <div className="w-24 h-24 rounded-full bg-amber-800/40 border-4 border-amber-600 flex items-center justify-center text-6xl shadow-inner">
              🌱
            </div>
            <p className="mt-2 font-black text-sm bg-black/20 px-3 py-1 rounded-full">Stage 1: Seed in Fresh Soil</p>
          </div>
        )}

        {/* Stage 2: Sprout / Plant */}
        {level === 2 && (
          <div className="flex flex-col items-center animate-float">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-emerald-500/30 border-4 border-white/80 flex items-center justify-center text-7xl shadow-xl backdrop-blur-sm">
                🌿
              </div>
              <span className="absolute -top-2 -right-2 text-2xl animate-spin" style={{ animationDuration: '8s' }}>🦋</span>
            </div>
            <p className="mt-2 font-black text-sm bg-black/20 px-3 py-1 rounded-full">Stage 2: Sprouting Green Plant</p>
          </div>
        )}

        {/* Stage 3: Growing Tree */}
        {level === 3 && (
          <div className="flex flex-col items-center animate-float">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-emerald-600/40 border-4 border-amber-200 flex items-center justify-center text-8xl shadow-2xl backdrop-blur-sm">
                🌳
              </div>
              <span className="absolute top-1 left-0 text-2xl">🐝</span>
              <span className="absolute bottom-0 right-0 text-2xl">🍎</span>
            </div>
            <p className="mt-2 font-black text-sm bg-black/20 px-3 py-1 rounded-full">Stage 3: Flourishing Action Tree</p>
          </div>
        )}

        {/* Stage 4: Lush Forest */}
        {level === 4 && (
          <div className="flex flex-col items-center animate-float">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-teal-600/40 border-4 border-teal-200 flex items-center justify-center text-8xl shadow-2xl backdrop-blur-sm">
                🌲
              </div>
              <span className="absolute top-0 right-0 text-2xl">🦊</span>
              <span className="absolute bottom-1 left-1 text-2xl">🦋</span>
            </div>
            <p className="mt-2 font-black text-sm bg-black/20 px-3 py-1 rounded-full">Stage 4: Wildlife Forest & River</p>
          </div>
        )}

        {/* Stage 5: Thriving Planet */}
        {level >= 5 && (
          <div className="flex flex-col items-center animate-pulse-glow">
            <div className="relative">
              <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 border-4 border-yellow-300 flex items-center justify-center text-8xl shadow-2xl">
                🌎
              </div>
              <span className="absolute -top-3 left-2 text-3xl animate-bounce">✨</span>
              <span className="absolute top-0 -right-2 text-3xl">🕊️</span>
              <span className="absolute -bottom-2 left-6 text-2xl">⚡</span>
            </div>
            <p className="mt-2 font-black text-sm bg-yellow-400 text-yellow-950 px-3 py-1 rounded-full border border-yellow-200 shadow">
              Stage 5: Thriving Sustainable Planet 🌟
            </p>
          </div>
        )}
      </div>

      {/* Progress Bar to next Level */}
      <div className="relative z-10 bg-white/20 backdrop-blur-md rounded-2xl p-3 border border-white/30">
        <div className="flex justify-between items-center text-xs font-bold text-white mb-1.5">
          <span>{currentLevelInfo.planetStage} ({currentLevelInfo.icon})</span>
          {nextLevelInfo ? (
            <span>Next: {nextLevelInfo.planetStage} ({nextLevelInfo.icon})</span>
          ) : (
            <span>Max Level Reached! 🎉</span>
          )}
        </div>
        <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden p-0.5 border border-white/30">
          <div
            className="bg-gradient-to-r from-amber-300 via-yellow-300 to-emerald-300 h-full rounded-full transition-all duration-500 shadow"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[11px] text-sky-100 mt-2 font-medium text-center italic">
          “{currentLevelInfo.planetDesc}”
        </p>
      </div>
    </div>
  );
}
