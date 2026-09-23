import React from 'react';
import { Sparkles, ArrowRight, Flame, BookOpen, Award, Compass, Sun, Droplets } from 'lucide-react';
import { VirtualPlanet } from './VirtualPlanet.jsx';
import { playClickSound } from '../../audio/soundFx.js';

export function ChildHome({ childProfile, todaysMission, onStartMission, onOpenBook, onNavigate }) {
  if (!childProfile) return null;

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* Welcome Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Hi, {childProfile.name}! 👋
          </h1>
          <p className="text-slate-600 font-medium text-sm">
            Ready to change the world today? Let’s save Earth! 🚀
          </p>
        </div>

        <button
          onClick={() => { playClickSound(); onNavigate('profile'); }}
          className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-2xl shadow-sm hover:scale-105 transition-transform"
        >
          👦
        </button>
      </div>

      {/* Virtual Planet Interactive Canvas Card */}
      <VirtualPlanet
        xp={childProfile.xp}
        level={childProfile.level}
        levelName={childProfile.levelName}
      />

      {/* Gamification Stats Bar */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
          <span className="text-xl">⭐</span>
          <span className="font-black text-lg text-amber-600">{childProfile.xp}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">XP</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
          <span className="text-xl">🔥</span>
          <span className="font-black text-lg text-rose-500">{childProfile.streak} Days</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Streak</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
          <span className="text-xl">🏅</span>
          <span className="font-black text-lg text-indigo-600">{childProfile.unlockedBadges.length}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Badges</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
          <span className="text-xl">📖</span>
          <span className="font-black text-lg text-teal-600">{childProfile.pagesCount || 3}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Book Pages</span>
        </div>
      </div>

      {/* TODAY'S MISSION Highlight Card */}
      {todaysMission && (
        <div className="relative rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 p-6 text-white shadow-xl overflow-hidden border-4 border-cyan-200">
          <div className="absolute -right-6 -bottom-6 text-9xl opacity-20 select-none">💧</div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-cyan-400/30 text-cyan-100 text-xs font-black uppercase px-3 py-1 rounded-full border border-cyan-300/40 tracking-wider">
                TODAY'S MISSION
              </span>
              <span className="bg-amber-400 text-amber-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow">
                +50 XP ⭐
              </span>
            </div>

            <h2 className="text-2xl font-black text-white mb-1.5 flex items-center gap-2">
              {todaysMission.title}
            </h2>

            <p className="text-cyan-100 text-sm font-medium mb-4 max-w-xl">
              {todaysMission.challengeText}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => { playClickSound(); onStartMission(todaysMission); }}
                className="btn-pop bg-amber-400 hover:bg-amber-300 text-amber-950 font-black px-6 py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-base border-2 border-amber-200"
              >
                <span>START MISSION</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-cyan-200 bg-white/10 px-3.5 py-2 rounded-xl border border-white/20">
                <span>🏅 Unlocks Badge:</span>
                <span className="text-white bg-cyan-900/60 px-2 py-0.5 rounded-md">Water Saver 💧</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECONDARY CALL TO ACTION: OPEN MY BOOK */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-5 text-amber-950 shadow-lg border-4 border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl shadow">
            📖
          </div>
          <div>
            <h3 className="text-xl font-black text-amber-950">MY SDG JOURNEY BOOK</h3>
            <p className="text-amber-900 text-xs font-semibold">
              3 pages collected! Turn pages & see your scrapbook adventure.
            </p>
          </div>
        </div>

        <button
          onClick={() => { playClickSound(); onOpenBook(); }}
          className="btn-pop w-full sm:w-auto bg-amber-950 hover:bg-black text-amber-300 font-black px-6 py-3 rounded-2xl shadow-md flex items-center justify-center gap-2 text-sm border border-amber-700 whitespace-nowrap"
        >
          <span>OPEN MY BOOK →</span>
        </button>
      </div>

      {/* Summer Vacation Challenge Special Banner */}
      <div 
        onClick={() => { playClickSound(); onNavigate('summer'); }}
        className="cursor-pointer bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 rounded-3xl p-4 text-white shadow-md flex items-center justify-between gap-3 hover:scale-[1.01] transition-transform border-2 border-rose-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
            ☀️
          </div>
          <div>
            <div className="text-xs font-black text-amber-200 uppercase tracking-wide">Special Program</div>
            <div className="font-black text-base text-white">SDG Summer Adventure (30 Days)</div>
          </div>
        </div>
        <div className="bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1">
          <span>12 / 30 Days</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
