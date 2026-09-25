import React from 'react';
import { Home, BookOpen, Target, Award, User, Sparkles, BookMarked } from 'lucide-react';
import { playClickSound } from '../../audio/soundFx.js';

export function Navigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'missions', label: 'Missions', icon: Target },
    { id: 'book', label: 'My Book', icon: BookMarked, highlight: true },
    { id: 'badges', label: 'Badges', icon: Award },
    { id: 'profile', label: 'Avatar', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl px-2 py-1.5">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-1">
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          const isHighlight = t.highlight;
          const IconComponent = t.icon;

          if (isHighlight) {
            return (
              <button
                key={t.id}
                onClick={() => {
                  playClickSound();
                  onTabChange(t.id);
                }}
                className="flex flex-col items-center justify-center relative -top-3 btn-pop px-1"
              >
                <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-400 via-orange-400 to-amber-500 p-0.5 shadow-lg border-2 border-white transition-transform ${
                  isActive ? 'ring-4 ring-amber-300 scale-105' : 'hover:scale-105'
                }`}>
                  <div className="w-full h-full rounded-full bg-amber-500 flex items-center justify-center text-white">
                    <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
                  </div>
                </div>
                <span className={`text-[10px] font-black mt-0.5 whitespace-nowrap ${isActive ? 'text-amber-600' : 'text-slate-600'}`}>
                  {t.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={t.id}
              onClick={() => {
                playClickSound();
                onTabChange(t.id);
              }}
              className={`flex-1 flex flex-col items-center py-1.5 px-1 rounded-2xl transition-all ${
                isActive
                  ? 'text-emerald-700 font-black bg-emerald-50 scale-105 shadow-xs'
                  : 'text-slate-500 font-bold hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-xl mb-0.5 ${isActive ? 'bg-emerald-100 text-emerald-800' : 'text-slate-500'}`}>
                <IconComponent className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[10px] tracking-tight whitespace-nowrap">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
