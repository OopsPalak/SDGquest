import React, { useState } from 'react';
import { Heart, CheckCircle2, BookOpen, Sparkles, ShieldCheck, Users } from 'lucide-react';
import { playClickSound, playSuccessSound } from '../../audio/soundFx.js';

export function ParentDashboard({ parentDigest, childProfile, onOpenBook }) {
  const [approvedFamilyMissions, setApprovedFamilyMissions] = useState([]);

  const handleFamilyApprove = (id) => {
    playSuccessSound();
    setApprovedFamilyMissions(prev => [...prev, id]);
  };

  const familyTasks = [
    { id: 'f1', title: 'Rainwater Garden Collector 🌧️', desc: 'Set up a small bucket on the patio to collect rainwater for plant watering.' },
    { id: 'f2', title: 'Zero Plastics Grocery Trip 🛍️', desc: 'Bring cloth bags to the market and skip plastic produce wrappers.' }
  ];

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 p-6 text-white shadow-xl flex items-center justify-between gap-4 border-4 border-purple-300">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center text-4xl shadow-inner">
            🏡
          </div>
          <div>
            <span className="bg-purple-300/30 text-purple-100 text-xs font-black uppercase px-2.5 py-0.5 rounded-full border border-purple-200/40">
              PARENT PORTAL
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {childProfile?.name || 'Leo'}'s Weekly Digest
            </h1>
            <p className="text-xs text-purple-200 font-medium">
              Celebrate your child's real-world sustainability habits & participate in family missions!
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Digest Cards */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-md space-y-4">
        <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
          <span>📊</span>
          <span>{childProfile?.name || 'Leo'}'s Activity This Week</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-cyan-50 p-4 rounded-2xl border border-cyan-200 text-center">
            <span className="text-2xl">💧</span>
            <div className="font-black text-xl text-cyan-900 mt-1">2 Water</div>
            <span className="text-[10px] font-bold text-cyan-700 uppercase">Missions</span>
          </div>

          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center">
            <span className="text-2xl">🌳</span>
            <div className="font-black text-xl text-emerald-900 mt-1">1 Nature</div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase">Missions</span>
          </div>

          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-center">
            <span className="text-2xl">♻️</span>
            <div className="font-black text-xl text-amber-900 mt-1">1 Recycling</div>
            <span className="text-[10px] font-bold text-amber-700 uppercase">Missions</span>
          </div>

          <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 text-center">
            <span className="text-2xl">❤️</span>
            <div className="font-black text-xl text-rose-900 mt-1">1 Health</div>
            <span className="text-[10px] font-bold text-rose-700 uppercase">Missions</span>
          </div>
        </div>
      </div>

      {/* Quick Access to SDG Book */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-5 text-amber-950 shadow-md border-2 border-amber-300 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl shadow">
            📖
          </div>
          <div>
            <h3 className="font-black text-lg text-amber-950">View {childProfile?.name}'s SDG Book</h3>
            <p className="text-xs text-amber-900 font-medium">Flip through stories & photos of your child's eco-adventures!</p>
          </div>
        </div>

        <button
          onClick={() => { playClickSound(); onOpenBook(); }}
          className="btn-pop bg-amber-950 text-amber-200 font-black px-5 py-2.5 rounded-2xl shadow text-xs whitespace-nowrap"
        >
          Open Book →
        </button>
      </div>

      {/* Family Eco-Missions */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-md space-y-4">
        <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
          <span>👨‍👩‍👧‍👦</span>
          <span>Family Weekend Eco Challenges</span>
        </h3>

        <div className="space-y-3">
          {familyTasks.map((ft) => {
            const isDone = approvedFamilyMissions.includes(ft.id);
            return (
              <div
                key={ft.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-black text-slate-900 text-base">{ft.title}</h4>
                  <p className="text-xs text-slate-600 font-medium">{ft.desc}</p>
                </div>

                {isDone ? (
                  <span className="bg-emerald-500 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verified 🎉</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleFamilyApprove(ft.id)}
                    className="btn-pop bg-purple-600 hover:bg-purple-700 text-white font-black px-4 py-2 rounded-xl text-xs shadow"
                  >
                    Verify at Home (+50 XP)
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
