import React from 'react';
import { Sparkles, ArrowRight, Flame, BookOpen, Award, Compass, Sun, Droplets, Target, User, Shield } from 'lucide-react';
import { VirtualPlanet } from './VirtualPlanet.jsx';
import { AvatarDisplay } from './AvatarDisplay.jsx';
import { SdgEmblem, MissionIllustration } from '../common/SdgArtwork.jsx';
import { LESSONS_DATA } from '../../utils/lessonsData.js';
import { playClickSound } from '../../audio/soundFx.js';

export function ChildHome({ childProfile, todaysMission, onStartMission, onOpenBook, onNavigate }) {
  if (!childProfile) return null;

  const recommendedLesson = LESSONS_DATA[0]; // SDG 6 Water
  const pagesCount = childProfile.pagesCount || 0;

  return (
    <div className="space-y-6 pb-28 max-w-4xl mx-auto px-4 pt-4">
      {/* 1. TOP GREETING & ROLE SWITCHER QUICK STATUS */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Welcome back, {childProfile.name}!</span>
          </h1>
          <p className="text-slate-600 font-semibold text-xs sm:text-sm">
            Learn SDGs, complete missions, and grow your living planet!
          </p>
        </div>

        <button
          onClick={() => { playClickSound(); onNavigate('profile'); }}
          className="btn-pop bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-2 border-emerald-300 font-black text-xs px-3.5 py-2 rounded-2xl shadow-sm flex items-center gap-1.5"
        >
          <User className="w-4 h-4 text-emerald-600" />
          <span>My Profile</span>
        </button>
      </div>

      {/* 2. AVATAR HOME WIDGET (Requirement 5) */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 rounded-3xl p-6 border-2 border-emerald-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Large Animated Illustrated Layered Avatar */}
          <div className="relative">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white border-2 border-emerald-200 shadow-md flex items-center justify-center overflow-hidden">
              <AvatarDisplay avatar={childProfile.avatar} size="md" animated={true} />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-400 text-amber-950 p-1.5 rounded-full border-2 border-white shadow">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-black uppercase text-emerald-800 tracking-wider flex items-center justify-center sm:justify-start gap-1">
              <Shield className="w-3.5 h-3.5" />
              <span>YOUR SDG EXPLORER</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              {childProfile.name}
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
              <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                Level {childProfile.level} — {childProfile.levelName}
              </span>
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                {childProfile.xp} Total XP
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => { playClickSound(); onNavigate('profile'); }}
          className="btn-pop w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-black px-6 py-3.5 rounded-2xl shadow text-xs flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <User className="w-4 h-4 text-emerald-400" />
          <span>CUSTOMIZE AVATAR</span>
        </button>
      </div>

      {/* 3. VIRTUAL PLANET CARD (GROWING PLANET) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>YOUR LIVING PLANET</span>
          </span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
            Stage: {childProfile.levelName || 'Seed'}
          </span>
        </div>

        <VirtualPlanet
          xp={childProfile.xp}
          level={childProfile.level}
          levelName={childProfile.levelName}
        />
      </div>

      {/* 4. GAMIFICATION STATS BAR (Proper vector icons instead of emojis) */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white/95 p-3 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
          <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-black text-lg text-amber-600">{childProfile.xp}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">XP Points</span>
        </div>

        <div className="bg-white/95 p-3 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
          <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
            <Award className="w-4 h-4" />
          </div>
          <span className="font-black text-lg text-emerald-600">Level {childProfile.level}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Current Level</span>
        </div>

        <div className="bg-white/95 p-3 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
          <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-1">
            <Flame className="w-4 h-4" />
          </div>
          <span className="font-black text-lg text-rose-500">{childProfile.streak || 1} Days</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Action Streak</span>
        </div>

        <div className="bg-white/95 p-3 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
          <div className="w-7 h-7 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-1">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-black text-lg text-teal-600">{pagesCount}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Book Pages</span>
        </div>
      </div>

      {/* 5. 📚 CONTINUE LEARNING SECTION */}
      <div className="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border-4 border-sky-200">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            {/* Thematic SDG Vector Emblem */}
            <SdgEmblem sdgNumber={recommendedLesson.sdgNumber} size="lg" className="border-2 border-white/60 rounded-2xl overflow-hidden shadow" />

            <div className="space-y-1">
              <span className="bg-white/20 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-white/30 tracking-wider">
                CONTINUE LEARNING
              </span>
              <div className="text-xs font-black text-sky-100 uppercase tracking-wide">
                SDG {recommendedLesson.sdgNumber} • {recommendedLesson.title}
              </div>
              <h2 className="text-2xl font-black text-white leading-tight">
                {recommendedLesson.childTitle}
              </h2>
              <p className="text-white/90 text-xs font-semibold max-w-md">
                "{recommendedLesson.tagline}"
              </p>
            </div>
          </div>

          <button
            onClick={() => { playClickSound(); onNavigate('learn'); }}
            className="btn-pop w-full sm:w-auto bg-white text-emerald-900 hover:bg-emerald-50 font-black px-6 py-3 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-sm border-2 border-white whitespace-nowrap"
          >
            <span>LEARN NOW</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 6. 🎯 TODAY'S MISSION (Visual Mission Artwork Card) */}
      {todaysMission && (
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden space-y-4">
          {/* Illustrated Mission Artwork Banner */}
          <MissionIllustration missionId={todaysMission.id} />

          <div className="p-6 pt-0 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-900 text-xs font-black uppercase px-3 py-1 rounded-full border border-indigo-200 tracking-wider">
                  TODAY'S MISSION
                </span>
                <span className="bg-amber-100 text-amber-950 font-black text-xs px-2.5 py-1 rounded-full border border-amber-300">
                  +{todaysMission.xpReward} XP Reward
                </span>
              </div>
              <span className="text-xs font-bold text-slate-500">SDG {todaysMission.sdgNumber}</span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">
                {todaysMission.title}
              </h2>
              <p className="text-slate-600 text-sm font-medium mt-1 max-w-xl">
                {todaysMission.challengeText}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Unlocks Badge:</span>
                <span className="font-black text-slate-900">{todaysMission.badgeName}</span>
              </div>

              <button
                onClick={() => { playClickSound(); onStartMission(todaysMission); }}
                className="btn-pop bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-3 rounded-2xl shadow-md flex items-center justify-center gap-2 text-sm border-2 border-emerald-300"
              >
                <span>START MISSION NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. 📖 YOUR PERSONAL SDG BOOK CTA */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-5 text-amber-950 shadow-lg border-4 border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-800 shadow">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-black text-amber-950">YOUR PERSONAL SDG BOOK</h3>
            <p className="text-amber-900 text-xs font-semibold">
              {pagesCount > 0 
                ? `Your adventure has ${pagesCount} collected page${pagesCount === 1 ? '' : 's'}! Flip pages & see your scrapbook.`
                : 'Your adventure has 0 pages! Your book is waiting for its first adventure!'
              }
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

      {/* 8. Summer Program Callout */}
      <div 
        onClick={() => { playClickSound(); onNavigate('summer'); }}
        className="cursor-pointer bg-white rounded-3xl p-4.5 border-2 border-slate-200 shadow-sm flex items-center justify-between gap-3 hover:border-amber-300 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-amber-700 tracking-wider">Summer Challenge</div>
            <div className="font-black text-sm text-slate-900">30-Day Summer Eco Adventure</div>
          </div>
        </div>
        <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
          <span>Explore Days</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
