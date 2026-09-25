import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, BookOpen, CheckCircle2, Award, Video, HelpCircle, Target, Globe, Star, Brain } from 'lucide-react';
import { INITIAL_MISSIONS, BADGES } from '../../utils/constants.js';
import { LESSONS_DATA } from '../../utils/lessonsData.js';
import { SdgEmblem, CollectibleBadge } from '../common/SdgArtwork.jsx';
import { playClickSound } from '../../audio/soundFx.js';

export function SDGDetailModal({
  sdg,
  onClose,
  onStartMission,
  onOpenQuiz,
  bookPages = [],
  unlockedBadges = [],
  completedQuizzes = {}
}) {
  if (!sdg) return null;

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'lesson' | 'watch' | 'quiz' | 'missions' | 'pages' | 'badges'

  // Corresponding lesson metadata (if available in 5 MVP SDGs)
  const lesson = LESSONS_DATA.find(l => l.sdgId === sdg.id || l.sdgNumber === sdg.number);
  const availableMissions = INITIAL_MISSIONS.filter(m => m.sdgId === sdg.id || m.sdgNumber === sdg.number);
  const sdgPages = bookPages.filter(p => p.sdgId === sdg.id || p.sdgNumber === sdg.number);
  const relatedBadge = BADGES.find(b => b.category === `SDG ${sdg.number}`) || BADGES[0];
  const isBadgeUnlocked = unlockedBadges.includes(relatedBadge?.id);
  const isQuizDone = !!completedQuizzes[sdg.id];

  // Dynamic Progress calculation
  let progressPoints = 0;
  if (isQuizDone) progressPoints += 30;
  if (sdgPages.length > 0) progressPoints += 40;
  if (isBadgeUnlocked) progressPoints += 30;
  const progressPercent = Math.min(100, progressPoints);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border-4 border-slate-100 my-auto animate-float">
        
        {/* Colorful Header Banner */}
        <div className={`p-6 text-white ${sdg.bgColor} relative overflow-hidden`}>
          <button
            onClick={() => { playClickSound(); onClose(); }}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {/* SDG Emblem Vector instead of emoji */}
              <div className="rounded-2xl overflow-hidden border-2 border-white/40 shadow-inner shrink-0">
                <SdgEmblem sdgNumber={sdg.number} size="md" />
              </div>
              <div>
                <span className="bg-white/20 text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border border-white/30">
                  SDG {sdg.number}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5 leading-tight">
                  {sdg.childTitle}
                </h2>
                <p className="text-white/80 text-xs font-bold">{sdg.title}</p>
              </div>
            </div>

            {/* Dynamic Progress Indicator */}
            <div className="bg-black/20 backdrop-blur-sm p-2.5 rounded-2xl border border-white/20 shrink-0 w-full sm:w-auto text-right">
              <div className="text-[10px] font-black uppercase tracking-wider text-white/80">
                Goal Mastery
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-24 bg-white/20 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-300 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="font-black text-xs text-amber-300">{progressPercent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Hub Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto text-xs font-black">
          <button
            onClick={() => { playClickSound(); setActiveTab('overview'); }}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Overview
          </button>

          {lesson && (
            <>
              <button
                onClick={() => { playClickSound(); setActiveTab('lesson'); }}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'lesson'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Learn
              </button>

              <button
                onClick={() => { playClickSound(); setActiveTab('watch'); }}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'watch'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                Watch
              </button>

              <button
                onClick={() => { playClickSound(); setActiveTab('quiz'); }}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'quiz'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                Quiz {isQuizDone && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
              </button>
            </>
          )}

          <button
            onClick={() => { playClickSound(); setActiveTab('missions'); }}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'missions'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            Missions ({availableMissions.length})
          </button>

          <button
            onClick={() => { playClickSound(); setActiveTab('pages'); }}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pages'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            My Pages ({sdgPages.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                <div className="flex items-center gap-2 text-amber-900 font-black text-sm mb-1.5">
                  <BookOpen className="w-4 h-4 text-amber-700" />
                  <span>The Adventure Story of SDG {sdg.number}</span>
                </div>
                <p className="text-amber-950 font-handwriting text-xl leading-snug">
                  "{sdg.story}"
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider">What this goal is about</span>
                <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                  {sdg.description}
                </p>
              </div>

              {/* Related Trophy Badge Preview — uses CollectibleBadge vector */}
              {relatedBadge && (
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CollectibleBadge badgeId={relatedBadge.id} unlocked={isBadgeUnlocked} size="sm" />
                    <div>
                      <div className="text-[10px] font-black uppercase text-slate-400">Associated Badge</div>
                      <h4 className="font-black text-sm text-slate-900">{relatedBadge.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{relatedBadge.desc}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                    isBadgeUnlocked ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {isBadgeUnlocked ? (
                      <><Sparkles className="w-2.5 h-2.5" /> UNLOCKED</>
                    ) : (
                      <>LOCKED</>
                    )}
                  </span>
                </div>
              )}

              {/* Quick Jump Buttons */}
              <div className="flex gap-2 pt-2">
                {lesson && (
                  <button
                    onClick={() => setActiveTab('lesson')}
                    className="btn-pop flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Read Lesson
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('missions')}
                  className="btn-pop flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow flex items-center justify-center gap-1.5"
                >
                  <Target className="w-3.5 h-3.5" />
                  View Missions
                </button>
              </div>
            </div>
          )}

          {/* 2. LESSON TAB */}
          {activeTab === 'lesson' && lesson && (
            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                <span className="text-xs font-black uppercase text-amber-900 block mb-1">Kid-Friendly Lesson</span>
                <p className="text-slate-800 text-sm font-bold leading-relaxed">
                  "{lesson.shortExplanation}"
                </p>
              </div>

              <div>
                <h4 className="font-black text-xs uppercase text-slate-500 mb-2">What Can YOU Do?</h4>
                <div className="space-y-2">
                  {lesson.whatYouCanDo.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <div className="font-black text-xs text-slate-900">{item.title}</div>
                        <p className="text-[11px] text-slate-600 font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('quiz')}
                className="btn-pop w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow flex items-center justify-center gap-2"
              >
                <span>READY? TAKE THE QUIZ 🧠</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 3. WATCH TAB */}
          {activeTab === 'watch' && lesson && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-700">{lesson.video.title}</span>
                <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{lesson.video.duration}</span>
              </div>
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-200 shadow">
                <iframe
                  src={lesson.video.embedUrl}
                  title={lesson.video.title}
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>
          )}

          {/* 4. QUIZ TAB */}
          {activeTab === 'quiz' && lesson && (
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-200 text-center space-y-4">
              <span className="text-5xl">🧠✨</span>
              <div>
                <h3 className="text-lg font-black text-slate-900">{lesson.quiz.title}</h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Test what you learned! Answer 3 fun questions to earn +{lesson.quiz.xpReward} XP!
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-indigo-100 inline-flex items-center gap-2 text-xs font-bold text-indigo-900">
                {isQuizDone ? (
                  <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> You have completed this quiz!</>
                ) : (
                  <><Sparkles className="w-3.5 h-3.5 text-indigo-600" /> +20 XP Reward • +10 Bonus for 100%</>
                )}
              </div>

              <div>
                <button
                  onClick={() => {
                    playClickSound();
                    onClose();
                    if (onOpenQuiz) onOpenQuiz(lesson);
                  }}
                  className="btn-pop w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <Brain className="w-4 h-4" />
                  {isQuizDone ? 'REPLAY QUIZ MINI-GAME' : 'START MINI-GAME QUIZ NOW'}
                </button>
              </div>
            </div>
          )}

          {/* 5. MISSIONS TAB */}
          {activeTab === 'missions' && (
            <div className="space-y-3">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-600" />
                <span>Real-World Missions ({availableMissions.length})</span>
              </h3>

              {availableMissions.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-slate-900 text-sm">{m.title}</span>
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> +{m.xpReward} XP
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">{m.challengeText}</p>
                  </div>

                  <button
                    onClick={() => {
                      playClickSound();
                      onClose();
                      onStartMission(m);
                    }}
                    className="btn-pop w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-black px-4 py-2 rounded-xl shadow text-xs whitespace-nowrap flex items-center gap-1.5"
                  >
                    Accept Mission <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 6. MY PAGES TAB */}
          {activeTab === 'pages' && (
            <div className="space-y-3">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>Scrapbook Pages for SDG {sdg.number}</span>
              </h3>

              {sdgPages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sdgPages.map((page) => (
                    <div key={page.id} className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                      <div className="aspect-video rounded-xl overflow-hidden bg-slate-100">
                        <img src={page.mediaUrl} alt={page.title} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="font-black text-xs text-slate-900">{page.title}</h4>
                      <p className="text-[11px] font-handwriting text-slate-700 line-clamp-2">"{page.caption}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-amber-50/60 border border-amber-200 text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-amber-100 rounded-2xl flex items-center justify-center border-2 border-amber-200">
                    <BookOpen className="w-8 h-8 text-amber-600" />
                  </div>
                  <div className="font-black text-xs text-amber-950">No book pages collected yet!</div>
                  <p className="text-[11px] text-amber-800 font-medium">Complete a mission for SDG {sdg.number} to earn your page in the SDG Book!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
