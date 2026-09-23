import React, { useState } from 'react';
import { Sun, CheckCircle2, ArrowRight, Sparkles, Award } from 'lucide-react';
import { playClickSound, playSuccessSound } from '../../audio/soundFx.js';

export function SummerAdventure({ summerData, onCompleteDay }) {
  const [activeDay, setActiveDay] = useState(13); // Default day

  const completedDays = summerData?.completedDays || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const totalDays = 30;

  const handleMarkComplete = (day) => {
    playSuccessSound();
    onCompleteDay(day);
  };

  const sampleDays = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const sdgNum = ((i % 17) + 1);
    return {
      day: dayNum,
      sdgNumber: sdgNum,
      title: `Day ${dayNum} Challenge`,
      task: `Micro-habit for SDG ${sdgNum}: Perform 1 simple eco action today!`,
      isDone: completedDays.includes(dayNum)
    };
  });

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* Summer Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 p-6 text-white shadow-xl border-4 border-amber-200 relative overflow-hidden">
        <div className="absolute top-2 right-4 text-8xl opacity-20 select-none">☀️</div>
        <div className="relative z-10 space-y-2">
          <span className="bg-white/20 text-white font-black text-xs uppercase px-3 py-1 rounded-full border border-white/30">
            ☀️ SPECIAL SUMMER PROGRAM
          </span>
          <h1 className="text-3xl font-black text-white">SDG Summer Adventure</h1>
          <p className="text-xs text-amber-100 font-medium max-w-md">
            Complete 30 daily micro-missions across 17 SDGs to earn the Master Young Change Maker Trophy!
          </p>

          <div className="pt-2 flex items-center gap-3">
            <div className="flex-1 bg-black/20 h-3 rounded-full overflow-hidden p-0.5 border border-white/30">
              <div
                className="bg-amber-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${(completedDays.length / totalDays) * 100}%` }}
              />
            </div>
            <span className="font-black text-xs text-white">
              {completedDays.length} / {totalDays} Days
            </span>
          </div>
        </div>
      </div>

      {/* 30-Day Grid */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-md space-y-4">
        <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
          <span>📅</span>
          <span>30-Day Mission Calendar</span>
        </h3>

        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
          {sampleDays.map((d) => (
            <button
              key={d.day}
              onClick={() => { playClickSound(); setActiveDay(d.day); }}
              className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-between text-center transition-all ${
                d.isDone
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-black shadow-sm'
                  : activeDay === d.day
                  ? 'bg-amber-400 border-amber-500 text-amber-950 font-black scale-110 shadow-md ring-2 ring-amber-300'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="text-[10px] font-bold opacity-75">Day</span>
              <span className="text-base font-black">{d.day}</span>
              <span className="text-xs">{d.isDone ? '✅' : '🌱'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Day Detail Card */}
      {activeDay && (
        <div className="bg-amber-50 p-6 rounded-3xl border-2 border-amber-200 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-amber-950 font-black text-xs px-3 py-1 rounded-full">
                DAY {activeDay} MICRO-MISSION
              </span>
              <span className="text-xs font-bold text-amber-800">SDG {((activeDay - 1) % 17) + 1}</span>
            </div>

            {completedDays.includes(activeDay) ? (
              <span className="bg-emerald-500 text-white font-black text-xs px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>COMPLETED 🎉</span>
              </span>
            ) : (
              <span className="bg-amber-200 text-amber-900 font-bold text-xs px-2.5 py-1 rounded-full">
                +20 XP ⭐
              </span>
            )}
          </div>

          <h3 className="font-black text-slate-900 text-xl">
            {sampleDays[activeDay - 1].task}
          </h3>

          {!completedDays.includes(activeDay) && (
            <button
              onClick={() => handleMarkComplete(activeDay)}
              className="btn-pop bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-3 rounded-2xl shadow-md flex items-center gap-2 text-sm"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>MARK DAY {activeDay} COMPLETE (+20 XP)</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
