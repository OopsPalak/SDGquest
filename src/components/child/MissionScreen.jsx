import React, { useState } from 'react';
import { ArrowLeft, CheckSquare, Square, Camera, Palette, FileText, Sparkles, Award, Star } from 'lucide-react';
import { playClickSound } from '../../audio/soundFx.js';

export function MissionScreen({ mission, onBack, onSubmitEvidence }) {
  const [checkedItems, setCheckedItems] = useState({});

  if (!mission) return null;

  const toggleCheck = (idx) => {
    playClickSound();
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalChecklist = mission.checklistItems ? mission.checklistItems.length : 4;
  const isReadyToSubmit = completedCount >= 1;

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto px-4 pt-4">
      {/* Back Button */}
      <button
        onClick={() => { playClickSound(); onBack(); }}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Missions</span>
      </button>

      {/* Mission Banner Card */}
      <div className="rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-6 text-white shadow-xl relative overflow-hidden border-4 border-cyan-200">
        <div className="absolute right-4 top-4 text-7xl opacity-20 select-none">🎯</div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-cyan-300/30 text-cyan-100 text-xs font-black uppercase px-3 py-1 rounded-full border border-cyan-200/40">
              SDG {mission.sdgNumber} Mission
            </span>
            <span className="bg-amber-400 text-amber-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow">
              +{mission.xpReward} XP ⭐
            </span>
          </div>

          <h1 className="text-3xl font-black text-white leading-tight">{mission.title}</h1>
        </div>
      </div>

      {/* Challenge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Main Challenge */}
        <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-blue-600 font-black text-sm uppercase">
            <span>🎯</span>
            <span>Your Challenge</span>
          </div>
          <p className="text-slate-800 text-base font-bold leading-snug">
            {mission.challengeText}
          </p>
        </div>

        {/* Bonus Challenge */}
        <div className="bg-amber-50 p-5 rounded-3xl border-2 border-amber-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-amber-800 font-black text-sm uppercase">
            <span>⭐</span>
            <span>Bonus Challenge</span>
          </div>
          <p className="text-amber-950 text-base font-medium leading-snug">
            {mission.bonusText || 'Share what you did with a friend or teacher!'}
          </p>
        </div>
      </div>

      {/* Interactive Progress Checklist */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
            <span>✅</span>
            <span>Progress Tracker</span>
          </h3>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full">
            {completedCount} / {totalChecklist} Completed
          </span>
        </div>

        <div className="space-y-2.5">
          {mission.checklistItems && mission.checklistItems.map((item, idx) => {
            const isChecked = !!checkedItems[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`cursor-pointer p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                  isChecked
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400 shrink-0" />
                )}
                <span className="text-sm font-medium">{item}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rewards Showcase */}
      <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 p-5 rounded-3xl text-amber-950 shadow-md border-2 border-amber-300 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl shadow">
            {mission.badgeIcon || '💧'}
          </div>
          <div>
            <div className="text-xs font-bold text-amber-900 uppercase">Rewards upon completion</div>
            <div className="font-black text-base text-amber-950 flex items-center gap-2">
              <span>⭐ +{mission.xpReward} XP</span>
              <span>•</span>
              <span>🏅 {mission.badgeName || 'Water Saver'} Badge</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2">
        <button
          onClick={() => { playClickSound(); onSubmitEvidence(mission); }}
          className="btn-pop w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-4 rounded-3xl shadow-xl border-4 border-emerald-200 flex items-center justify-center gap-3 text-lg"
        >
          <Camera className="w-6 h-6" />
          <span>CAPTURE MOMENT & SUBMIT EVIDENCE 📸🎨</span>
        </button>
      </div>
    </div>
  );
}
