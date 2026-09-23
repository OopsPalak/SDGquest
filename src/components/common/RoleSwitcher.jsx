import React from 'react';
import { Volume2, VolumeX, Sparkles, UserCheck, GraduationCap, Heart, Shield } from 'lucide-react';
import { isSoundEnabled, toggleSound, playClickSound } from '../../audio/soundFx.js';

export function RoleSwitcher({ currentRole, onRoleChange, childProfile, soundOn, setSoundOn }) {
  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    if (newState) playClickSound();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* App Logo & Title */}
        <div 
          onClick={() => { onRoleChange('child'); playClickSound(); }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center text-2xl shadow-md group-hover:scale-105 transition-transform">
            🌎
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-outfit font-extrabold text-xl text-slate-900 tracking-tight">SDG QUEST</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                K-5 Adventure
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">Learn • Do • Collect • Save the Planet</p>
          </div>
        </div>

        {/* Middle Role Switcher Pill */}
        <div className="bg-slate-100 p-1 rounded-full flex items-center border border-slate-200 text-xs font-bold shadow-inner">
          <button
            onClick={() => { onRoleChange('child'); playClickSound(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              currentRole === 'child'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md scale-105'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>👦</span>
            <span>Child View</span>
          </button>

          <button
            onClick={() => { onRoleChange('teacher'); playClickSound(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              currentRole === 'teacher'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md scale-105'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Teacher</span>
          </button>

          <button
            onClick={() => { onRoleChange('parent'); playClickSound(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              currentRole === 'parent'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md scale-105'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Parent</span>
          </button>
        </div>

        {/* Right Side Stats & Sound Toggle */}
        <div className="flex items-center gap-3">
          {currentRole === 'child' && childProfile && (
            <div className="hidden md:flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1 rounded-full text-xs font-bold">
              <span className="text-sm">⭐</span>
              <span>{childProfile.xp} XP</span>
              <span className="text-amber-300">|</span>
              <span>Lvl {childProfile.level}</span>
            </div>
          )}

          <button
            onClick={handleSoundToggle}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-700 transition-colors"
            title={soundOn ? "Mute sound FX" : "Enable sound FX"}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>
    </header>
  );
}
