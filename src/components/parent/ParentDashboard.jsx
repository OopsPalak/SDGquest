import React, { useState } from 'react';
import { Heart, CheckCircle2, BookOpen, Sparkles, Plus } from 'lucide-react';
import { playClickSound } from '../../audio/soundFx.js';

export function ParentDashboard({ parentDigest, childProfile, children = [], approvedSubmissions = [], familyMissions = [], onSelectChild, onCreateFamilyMission, onCompleteFamilyMission, onOpenBook }) {
  const [familyTitle, setFamilyTitle] = useState('');
  const [familyDescription, setFamilyDescription] = useState('');

  const handleCreateFamilyMission = (event) => {
    event.preventDefault();
    onCreateFamilyMission({ title: familyTitle, description: familyDescription });
    setFamilyTitle('');
    setFamilyDescription('');
  };

  if (!children.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-24 space-y-4">
        <div className="rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 p-6 text-white shadow-xl border-4 border-purple-300">
          <span className="bg-purple-300/30 text-purple-100 text-xs font-black uppercase px-2.5 py-0.5 rounded-full border border-purple-200/40">PARENT PORTAL</span>
          <h1 className="text-2xl font-black mt-2">Welcome, {parentDigest?.parentName || 'Parent'}</h1>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm font-semibold text-slate-600">
          No verified child account is linked yet.
        </div>
      </div>
    );
  }

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
        {children.length > 1 && (
          <label className="text-xs font-bold text-white">Child
            <select value={childProfile?.id || ''} onChange={(event) => onSelectChild(children.find((child) => child.id === event.target.value))} className="mt-1 block max-w-full rounded-xl border border-white/50 bg-white px-3 py-2 text-slate-900">
              {children.map((child) => <option key={child.id} value={child.id}>{child.name}</option>)}
            </select>
          </label>
        )}
      </div>

      {/* Weekly Digest Cards */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-md space-y-4">
        <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
          <span>📊</span>
          <span>{childProfile?.name || 'Leo'}'s Activity This Week</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-cyan-50 p-4 rounded-2xl border border-cyan-200 text-center">
            <span className="text-2xl">🎯</span>
            <div className="font-black text-xl text-cyan-900 mt-1">{approvedSubmissions.length}</div>
            <span className="text-[10px] font-bold text-cyan-700 uppercase">Approved Missions</span>
          </div>

          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center">
            <span className="text-2xl">⭐</span>
            <div className="font-black text-xl text-emerald-900 mt-1">{childProfile?.xp || 0}</div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase">XP Earned</span>
          </div>

          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-center">
            <span className="text-2xl">🏅</span>
            <div className="font-black text-xl text-amber-900 mt-1">{childProfile?.unlockedBadges?.length || 0}</div>
            <span className="text-[10px] font-bold text-amber-700 uppercase">Badges</span>
          </div>

          <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 text-center">
            <span className="text-2xl">📖</span>
            <div className="font-black text-xl text-rose-900 mt-1">{childProfile?.pagesCount || 0}</div>
            <span className="text-[10px] font-bold text-rose-700 uppercase">Book Pages</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-black text-slate-900">Recent Quiz Results</h3>
        {childProfile?.quizAttempts?.length ? (
          <div className="mt-3 divide-y divide-slate-100">
            {childProfile.quizAttempts.slice(0, 5).map((attempt) => (
              <div key={attempt.id} className="flex items-center justify-between py-2 text-sm">
                <span className="font-semibold text-slate-700">{attempt.quiz_id}</span>
                <span className="font-black text-emerald-700">{attempt.score}/{attempt.total}</span>
              </div>
            ))}
          </div>
        ) : <p className="mt-2 text-xs text-slate-500">No quiz attempts yet.</p>}
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-black text-slate-900">SDG Progress</h3>
        {childProfile?.sdgProgress?.length ? (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {childProfile.sdgProgress.map((item) => (
              <div key={item.sdg_number} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-black text-slate-700">SDG {item.sdg_number}</div>
                <div className="mt-1 h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${item.progress}%` }} /></div>
                <div className="mt-1 text-right text-[10px] font-bold text-slate-500">{item.progress}%</div>
              </div>
            ))}
          </div>
        ) : <p className="mt-2 text-xs text-slate-500">No SDG progress recorded yet.</p>}
        {childProfile?.planetProgress && <p className="mt-3 text-xs font-bold text-emerald-800">Virtual planet: {childProfile.planetProgress.progress}%</p>}
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
            <span>Family Eco-Missions</span>
        </h3>

        <form onSubmit={handleCreateFamilyMission} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
          <input required maxLength={120} value={familyTitle} onChange={(event) => setFamilyTitle(event.target.value)} placeholder="Family mission" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input maxLength={1000} value={familyDescription} onChange={(event) => setFamilyDescription(event.target.value)} placeholder="What will you do together?" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <button disabled={!childProfile?.id} className="btn-pop flex items-center justify-center gap-1 rounded-xl bg-purple-600 px-4 py-2 text-xs font-black text-white disabled:opacity-50"><Plus className="h-4 w-4" />Add Mission</button>
        </form>

        <div className="space-y-3">
          {familyMissions.length === 0 && <p className="text-sm text-slate-500">No family missions yet.</p>}
          {familyMissions.map((mission) => (
            <div key={mission.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-black text-slate-900 text-base">{mission.title}</h4>
                <p className="text-xs text-slate-600 font-medium">{mission.description}</p>
              </div>
              {mission.status === 'completed' ? (
                <span className="bg-emerald-100 text-emerald-900 font-black text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1"><CheckCircle2 className="w-4 h-4" />Completed</span>
              ) : (
                <button onClick={() => onCompleteFamilyMission(mission.id)} className="btn-pop bg-purple-600 hover:bg-purple-700 text-white font-black px-4 py-2 rounded-xl text-xs">Mark complete</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
