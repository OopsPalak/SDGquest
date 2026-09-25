import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ArrowRight, Sparkles, Video, Target, Camera, Layers, Brain, Leaf, Droplets, Timer, CloudRain, TreePine, Bug, Recycle, ShoppingBag, Apple, Lightbulb, Bike, PlugZap, HeartPulse } from 'lucide-react';
import { LESSONS_DATA } from '../../utils/lessonsData.js';
import { MissionIllustration, SdgEmblem } from '../common/SdgArtwork.jsx';
import { playClickSound } from '../../audio/soundFx.js';

export function LessonsView({ onOpenQuiz, onStartMission, completedQuizzes = {} }) {
  const [selectedLessonId, setSelectedLessonId] = useState(6); // Default SDG 6 Water
  const activeLesson = LESSONS_DATA.find(l => l.sdgId === selectedLessonId) || LESSONS_DATA[0];

  const isQuizDone = !!completedQuizzes[activeLesson.sdgId];
  const actionIcons = [
    [Droplets, Timer, CloudRain],
    [TreePine, Bug, Recycle],
    [Recycle, ShoppingBag, Apple],
    [Lightbulb, Bike, PlugZap],
    [HeartPulse, Leaf, Droplets]
  ][LESSONS_DATA.findIndex(lesson => lesson.sdgId === activeLesson.sdgId)] || [Leaf, Sparkles, Target];

  return (
    <div className="space-y-6 pb-28 max-w-4xl mx-auto px-4 pt-4">
      {/* Title & Pitch */}
      <div className="text-center space-y-1">
        <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-black uppercase px-3 py-1 rounded-full border border-emerald-300">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          EXPLORE &amp; LEARN
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          SDG Adventure Lessons
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-lg mx-auto">
          Discover why each Sustainable Goal matters, watch fun videos, test your wits in mini-quizzes, and take real-world action!
        </p>
      </div>

      {/* 6-Step Learning Flow Visual Ribbon */}
      <div className="bg-white/95 p-3.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[550px] text-[11px] font-black uppercase tracking-wider text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200">
            <BookOpen className="w-3.5 h-3.5" />
            <span>1. LEARN</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <div className="flex items-center gap-1.5 text-sky-600 bg-sky-50 px-2.5 py-1.5 rounded-xl border border-sky-200">
            <Video className="w-3.5 h-3.5" />
            <span>2. WATCH</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-2.5 py-1.5 rounded-xl border border-indigo-200">
            <Brain className="w-3.5 h-3.5" />
            <span>3. QUIZ</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-200">
            <Target className="w-3.5 h-3.5" />
            <span>4. DO</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <div className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-2.5 py-1.5 rounded-xl border border-rose-200">
            <Camera className="w-3.5 h-3.5" />
            <span>5. CAPTURE</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <div className="flex items-center gap-1.5 text-teal-600 bg-teal-50 px-2.5 py-1.5 rounded-xl border border-teal-200">
            <Layers className="w-3.5 h-3.5" />
            <span>6. COLLECT</span>
          </div>
        </div>
      </div>

      {/* SDG Lesson Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {LESSONS_DATA.map((lesson) => {
          const isSelected = lesson.sdgId === selectedLessonId;
          const isDone = !!completedQuizzes[lesson.sdgId];

          return (
            <button
              key={lesson.sdgId}
              onClick={() => { playClickSound(); setSelectedLessonId(lesson.sdgId); }}
              className={`btn-pop px-3.5 py-2.5 rounded-2xl border-2 flex items-center gap-2 shrink-0 transition-all ${
                isSelected
                  ? `${lesson.bgColor} text-white border-white shadow-md scale-105`
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div className="rounded-lg overflow-hidden border border-slate-200/70">
                <SdgEmblem sdgNumber={lesson.sdgNumber} size="sm" />
              </div>
              <div className="text-left">
                <div className={`text-[10px] font-black uppercase ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                  SDG {lesson.sdgNumber}
                </div>
                <div className="text-xs font-black whitespace-nowrap">
                  {lesson.childTitle}
                </div>
              </div>
              {isDone && (
                <CheckCircle2 className="w-4 h-4 text-emerald-300 ml-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* MAIN ACTIVE LESSON CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xl space-y-6">
        
        {/* Lesson Header Banner */}
        <div className={`p-6 rounded-2xl text-white ${activeLesson.bgColor} relative overflow-hidden shadow-md`}>
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full border border-white/30">
                SDG {activeLesson.sdgNumber} • {activeLesson.title}
              </span>
              <span className="bg-amber-300 text-amber-950 font-black text-xs px-2.5 py-1 rounded-full shadow">
                {activeLesson.tagline}
              </span>
            </div>

            <div className="grid sm:grid-cols-[1fr_220px] gap-5 items-center pt-2">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl overflow-hidden border-2 border-white/30 shadow-inner">
                  <SdgEmblem sdgNumber={activeLesson.sdgNumber} size="md" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    {activeLesson.childTitle}
                  </h2>
                  <p className="text-white/90 text-xs font-semibold">
                    Step 1: Read &amp; Understand
                  </p>
                </div>
              </div>
              <MissionIllustration missionId={activeLesson.missionId} className="border border-white/30 shadow-inner" />
            </div>
          </div>
        </div>

        {/* Short Child-Friendly Explanation */}
        <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200 space-y-1.5">
          <div className="flex items-center gap-2 text-amber-900 font-black text-sm uppercase">
            <BookOpen className="w-4 h-4 text-amber-700" />
            <span>Why Does This Goal Matter?</span>
          </div>
          <p className="text-slate-800 text-base font-bold leading-relaxed">
            "{activeLesson.shortExplanation}"
          </p>
        </div>

        {/* Fun Illustrated Facts */}
        <div>
          <h3 className="font-black text-slate-900 text-base mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Did You Know? Amazing Earth Facts</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activeLesson.funFacts.map((fact, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-start gap-2 hover:border-emerald-300 transition-colors"
              >
                <SdgEmblem sdgNumber={activeLesson.sdgNumber} size="sm" />
                <p className="text-xs text-slate-700 font-bold leading-snug">
                  {fact.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* WHAT CAN YOU DO? Action Tips */}
        <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-emerald-950 text-base flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>What Can YOU Do Every Day?</span>
            </h3>
            <span className="text-xs font-black text-emerald-700">3 Easy Eco Habits</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activeLesson.whatYouCanDo.map((item, idx) => {
              const ActionIcon = actionIcons[idx];
              return (
              <div key={idx} className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-sm space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <ActionIcon className="w-4 h-4" />
                  </span>
                  <span className="font-black text-xs text-emerald-900">{item.title}</span>
                </div>
                <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">
                  {item.desc}
                </p>
              </div>
              );
            })}
          </div>
        </div>

        {/* WATCH & LEARN YOUTUBE SECTION */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Video className="w-4 h-4 text-rose-500" />
              <span>WATCH &amp; LEARN: Educational Video</span>
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {activeLesson.video.duration} • {activeLesson.video.channel}
            </span>
          </div>

          {/* Embedded YouTube Player */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border-4 border-slate-200 shadow-lg">
            <iframe
              src={activeLesson.video.embedUrl}
              title={activeLesson.video.title}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
          <p className="text-xs text-slate-500 text-center italic">
            Safe, child-friendly educational video for SDG {activeLesson.sdgNumber}. Tap play to watch anytime!
          </p>
        </div>

        {/* BOTTOM ACTION BUTTONS: QUIZ & MISSION */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => { playClickSound(); onOpenQuiz(activeLesson); }}
            className={`btn-pop w-full sm:flex-1 py-3.5 rounded-2xl font-black text-sm shadow-md flex items-center justify-center gap-2 border-2 ${
              isQuizDone
                ? 'bg-amber-100 text-amber-950 border-amber-300 hover:bg-amber-200'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-300'
            }`}
          >
            <Brain className="w-5 h-5" />
            <span>{isQuizDone ? 'RETAKE QUIZ (COMPLETED)' : 'TAKE QUIZ (+20 XP)'}</span>
            {isQuizDone && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          </button>

          <button
            onClick={() => { playClickSound(); onStartMission(activeLesson.missionId); }}
            className="btn-pop w-full sm:flex-1 py-3.5 rounded-2xl font-black text-sm shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-2 border-emerald-300"
          >
            <Target className="w-5 h-5" />
            <span>START SDG MISSION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
