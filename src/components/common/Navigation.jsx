import React from 'react';
import { Home, BookOpen, Target, Award, User, Sparkles } from 'lucide-react';
import { playClickSound } from '../../audio/soundFx.js';

export function Navigation({ activeTab, onTabChange, activeMissionCount = 1 }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home, emoji: '🏠' },
    { id: 'sdgs', label: 'SDGs', icon: Target, emoji: '🎯' },
    { id: 'book', label: 'My Book', icon: BookOpen, emoji: '📖', highlight: true },
    { id: 'badges', label: 'Badges', icon: Award, emoji: '🏅' },
    { id: 'profile', label: 'Profile', icon: User, emoji: '👤' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-2">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          const isHighlight = t.highlight;

          if (isHighlight) {
            return (
              <button
                key={t.id}
                onClick={() => {
                  playClickSound();
                  onTabChange(t.id);
                }}
                className={`flex flex-col items-center justify-center relative -top-3 btn-pop`}
              >
                <div className={`w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 via-orange-400 to-amber-500 p-0.5 shadow-lg border-2 border-white ${
                  isActive ? 'ring-4 ring-amber-300 scale-110' : ''
                }`}>
                  <div className="w-full h-full rounded-full bg-amber-500 flex items-center justify-center text-2xl">
                    {t.emoji}
                  </div>
                </div>
                <span className={`text-[11px] font-bold mt-0.5 ${isActive ? 'text-amber-600' : 'text-slate-600'}`}>
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
              className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'text-emerald-600 font-extrabold bg-emerald-50 scale-105'
                  : 'text-slate-500 font-bold hover:text-slate-800'
              }`}
            >
              <span className="text-xl mb-0.5">{t.emoji}</span>
              <span className="text-[11px] tracking-tight">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
