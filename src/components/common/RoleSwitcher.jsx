import React from 'react';
import { Volume2, VolumeX, Sparkles, GraduationCap, Heart, User, ArrowRightLeft, Globe } from 'lucide-react';
import { AvatarDisplay } from '../child/AvatarDisplay.jsx';
import { toggleSound, playClickSound } from '../../audio/soundFx.js';

export function RoleSwitcher({
  currentRole,
  demoPreview = false,
  onSwitchUser,
  childProfile,
  teacherData,
  parentDigest,
  soundOn,
  setSoundOn
}) {
  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    if (newState) playClickSound();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* App Logo & Title */}
        <div className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform overflow-hidden p-1.5">
            <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow">
              <circle cx="20" cy="20" r="18" fill="#0284c7" />
              <path d="M10 16 Q18 12 24 16 Q28 20 22 28 Q14 30 10 24 Z" fill="#22c55e" />
              <path d="M22 8 Q28 10 32 14 Q30 18 26 16 Z" fill="#22c55e" />
              <circle cx="28" cy="12" r="1.5" fill="#facc15" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans font-black text-xl text-slate-900 tracking-tight">SDG QUEST</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                Eco Adventure
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold hidden sm:block">Learn • Do • Capture • Collect</p>
          </div>
        </div>

        {/* Middle Role Switcher Bar */}
        <div className="flex items-center gap-2">
          {demoPreview && <span className="rounded-full border border-amber-300 bg-amber-100 px-2.5 py-1 text-[10px] font-black uppercase text-amber-950">Demo Preview</span>}
          {/* Quick Active Role Pill */}
          {currentRole === 'child' && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold bg-emerald-100 text-emerald-900 border-emerald-300 shadow-xs">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center overflow-hidden border border-emerald-300 shrink-0">
                <AvatarDisplay avatar={childProfile?.avatar} size="xs" animated={false} />
              </div>
              <span className="font-black">{childProfile?.name || 'Student'}</span>
            </div>
          )}

          {currentRole === 'teacher' && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold bg-indigo-100 text-indigo-900 border-indigo-300 shadow-xs">
              <GraduationCap className="w-4 h-4 text-indigo-700" />
              <span className="font-black">{teacherData?.name || 'Ms. Clara Vance'}</span>
            </div>
          )}

          {currentRole === 'parent' && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold bg-purple-100 text-purple-900 border-purple-300 shadow-xs">
              <Heart className="w-4 h-4 text-purple-700 fill-purple-700" />
              <span className="font-black">{parentDigest?.parentName || 'Parent Portal'}</span>
            </div>
          )}

          {/* Switch Role Button */}
          <button
            onClick={() => { playClickSound(); onSwitchUser(); }}
            className="btn-pop bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-bold flex items-center gap-1.5 shadow-sm"
            title={demoPreview ? "Switch demo role" : "Log out of SDG Quest"}
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">{demoPreview ? 'Switch Demo' : 'Log Out'}</span>
            <span className="md:hidden">Exit</span>
          </button>
        </div>

        {/* Right Side Stats & Sound Toggle */}
        <div className="flex items-center gap-2.5">
          {currentRole === 'child' && childProfile && (
            <div className="hidden md:flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
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
