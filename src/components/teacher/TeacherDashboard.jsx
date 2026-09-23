import React, { useState } from 'react';
import { GraduationCap, CheckCircle2, XCircle, Plus, Award, Users, BookOpen, Clock, Sparkles, MessageSquare } from 'lucide-react';
import { playClickSound, playSuccessSound } from '../../audio/soundFx.js';

export function TeacherDashboard({ teacherData, submissions = [], onVerifySubmission, onCreateMission, onOpenCertificateGen }) {
  const [activeTab, setActiveTab] = useState('submissions'); // 'submissions', 'students', 'create'
  const [feedbackInput, setFeedbackInput] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Mission State
  const [newMissionTitle, setNewMissionTitle] = useState('');
  const [newMissionSdg, setNewMissionSdg] = useState(6);
  const [newMissionText, setNewMissionText] = useState('');

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const approvedSubmissions = submissions.filter(s => s.status === 'approved');

  const handleApprove = (subId) => {
    playSuccessSound();
    const comment = feedbackInput[subId] || 'Great job! Awesome sustainability action! 🌟';
    onVerifySubmission(subId, 'approved', comment);
  };

  const handleReject = (subId) => {
    playClickSound();
    const comment = feedbackInput[subId] || 'Please add a photo or drawing showing your action! 🌿';
    onVerifySubmission(subId, 'rejected', comment);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newMissionTitle) return;
    playSuccessSound();
    onCreateMission({
      title: newMissionTitle,
      sdgId: newMissionSdg,
      sdgNumber: newMissionSdg,
      challengeText: newMissionText || 'Perform this eco-habit for your school!',
      bonusText: 'Share your findings in class.',
      xpReward: 50,
      badgeName: 'Classroom Hero',
      badgeIcon: '🏅'
    });
    setNewMissionTitle('');
    setNewMissionText('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 pt-4">
      {/* Teacher Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-900 p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-4 border-indigo-300">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center text-4xl shadow-inner">
            👩‍🏫
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-400/30 text-indigo-100 text-xs font-black uppercase px-2.5 py-0.5 rounded-full border border-indigo-300/40">
                CLASSROOM DASHBOARD
              </span>
              <span className="bg-emerald-400 text-emerald-950 font-black text-xs px-2.5 py-0.5 rounded-full">
                {teacherData?.className || 'Class 5A'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Welcome, {teacherData?.name || 'Ms. Clara Vance'}!
            </h1>
            <p className="text-xs text-indigo-200 font-medium">
              Review student evidence, track class SDG progress & generate official certificates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => { playClickSound(); setShowCreateModal(true); }}
            className="btn-pop flex-1 md:flex-initial bg-amber-400 hover:bg-amber-300 text-amber-950 font-black px-4 py-2.5 rounded-xl shadow text-xs flex items-center justify-center gap-1.5 border border-amber-200"
          >
            <Plus className="w-4 h-4" />
            <span>Create Mission</span>
          </button>

          <button
            onClick={() => { playClickSound(); onOpenCertificateGen(); }}
            className="btn-pop flex-1 md:flex-initial bg-white text-indigo-900 font-black px-4 py-2.5 rounded-xl shadow text-xs flex items-center justify-center gap-1.5 hover:bg-slate-100"
          >
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Certificates</span>
          </button>
        </div>
      </div>

      {/* Class Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-black">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Students Enrolled</div>
            <div className="text-2xl font-black text-slate-900">{teacherData?.totalStudents || 32} Students</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-black">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Mission Completion</div>
            <div className="text-2xl font-black text-emerald-600">{teacherData?.completionRate || 84}% Avg</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl font-black">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Pending Approvals</div>
            <div className="text-2xl font-black text-amber-600">{pendingSubmissions.length} Items</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => { playClickSound(); setActiveTab('submissions'); }}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
            activeTab === 'submissions'
              ? 'bg-indigo-600 text-white shadow'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Verification Queue ({pendingSubmissions.length}) 🟡
        </button>

        <button
          onClick={() => { playClickSound(); setActiveTab('students'); }}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
            activeTab === 'students'
              ? 'bg-indigo-600 text-white shadow'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Class Roster & Books 📚
        </button>
      </div>

      {/* Verification Queue Section */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
            <span>🟡</span>
            <span>Student Evidence Awaiting Review ({pendingSubmissions.length})</span>
          </h3>

          {pendingSubmissions.length > 0 ? (
            pendingSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-white p-5 rounded-3xl border-2 border-amber-200 shadow-md flex flex-col md:flex-row items-start justify-between gap-5"
              >
                {/* Media Preview */}
                <div className="w-full md:w-56 aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-300 shrink-0">
                  <img src={sub.mediaUrl} alt="Evidence" className="w-full h-full object-cover" />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-base">Child: {sub.childName}</span>
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                      🟡 Pending Review
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    "{sub.caption}"
                  </p>

                  {/* Teacher Feedback input */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">
                      Add Teacher Note/Feedback for Child:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Fantastic job! Loved your picture! 🌟"
                      value={feedbackInput[sub.id] || ''}
                      onChange={(e) => setFeedbackInput({ ...feedbackInput, [sub.id]: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                </div>

                {/* Approve/Reject Buttons */}
                <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-2 w-full md:w-40 shrink-0">
                  <button
                    onClick={() => handleApprove(sub.id)}
                    className="btn-pop bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2.5 px-4 rounded-xl text-xs shadow flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>APPROVE 🎉</span>
                  </button>

                  <button
                    onClick={() => handleReject(sub.id)}
                    className="btn-pop bg-rose-100 text-rose-700 hover:bg-rose-200 font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Needs Update</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-200 text-center space-y-2">
              <span className="text-4xl">✨</span>
              <h4 className="font-black text-emerald-950 text-lg">All Submissions Approved!</h4>
              <p className="text-xs text-emerald-800 font-medium">Your students are up-to-date with their SDG Book pages.</p>
            </div>
          )}
        </div>
      )}

      {/* Class Roster Section */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
            <span>📚</span>
            <span>Class 5A Student Directory</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {teacherData?.students?.map((s) => (
              <div key={s.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl shadow-sm">
                  {s.avatarIcon}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">{s.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">Level {s.level} • {s.xp} XP</p>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 inline-block mt-1">
                    📖 {s.bookPages} Book Pages
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Mission Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateSubmit} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border-4 border-slate-100">
            <h2 className="text-xl font-black text-slate-900">Create Custom Class Mission 🎯</h2>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Mission Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Bring a Zero-Waste Lunch box"
                value={newMissionTitle}
                onChange={(e) => setNewMissionTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Target SDG (1 - 17)</label>
              <select
                value={newMissionSdg}
                onChange={(e) => setNewMissionSdg(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-sm"
              >
                <option value={6}>SDG 6: Clean Water & Sanitation</option>
                <option value={15}>SDG 15: Life on Land</option>
                <option value={12}>SDG 12: Responsible Consumption</option>
                <option value={13}>SDG 13: Climate Action</option>
                <option value={3}>SDG 3: Good Health & Well-being</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Challenge Instructions</label>
              <textarea
                rows={3}
                placeholder="Explain what the children should do..."
                value={newMissionText}
                onChange={(e) => setNewMissionText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-pop flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-black text-xs shadow"
              >
                Assign Mission
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
