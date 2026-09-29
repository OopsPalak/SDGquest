import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClickSound, playSuccessSound, playLevelUpSound } from '../../audio/soundFx.js';

export function QuizModal({ lesson, onClose, onComplete, onStartMission }) {
  if (!lesson || !lesson.quiz) return null;

  const quiz = lesson.quiz;
  const questions = quiz.questions || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const currentQ = questions[currentIdx];
  const totalQ = questions.length;

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    setSelectedAnswers((previous) => ({ ...previous, [currentQ.id]: index }));

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      playSuccessSound();
      setScore(prev => prev + 1);
    } else {
      playClickSound();
    }
  };

  const handleNext = async () => {
    playClickSound();
    if (currentIdx < totalQ - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz complete!
      setIsSubmitting(true);
      setSubmitError('');
      try {
        const answers = Object.fromEntries(Object.entries(selectedAnswers).map(([questionId, answer]) => [questionId, String(answer)]));
        const result = await onComplete(quiz.id, answers);
        setScore(result.score);
        setEarnedXp(result.xp_awarded || 0);
        setIsFinished(true);
        playLevelUpSound();
        try {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch {}
      } catch (error) {
        setSubmitError(error.message || 'Your quiz could not be saved. Try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRestart = () => {
    playClickSound();
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setSelectedAnswers({});
    setSubmitError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border-4 border-slate-100 my-auto animate-float">
        
        {/* Top Header */}
        <div className={`p-5 text-white ${lesson.bgColor} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl p-1 bg-white/20 rounded-2xl border border-white/40">
              {lesson.icon}
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full text-white/90">
                SDG {lesson.sdgNumber} Mini-Game Quiz
              </span>
              <h2 className="text-xl font-black text-white leading-tight">
                {quiz.title}
              </h2>
            </div>
          </div>

          <button
            onClick={() => { playClickSound(); onClose(); }}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quiz Body */}
        {!isFinished ? (
          <div className="p-6 space-y-5">
            {/* Progress Bar & Counter */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-black text-slate-500">
                <span>Question {currentIdx + 1} of {totalQ}</span>
                <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  +{quiz.xpReward} XP Reward ⭐
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / totalQ) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                {currentQ.question}
              </h3>
            </div>

            {/* Answer Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;
                const optionLetter = String.fromCharCode(65 + idx);

                let btnStyle = "bg-white border-2 border-slate-200 hover:border-emerald-300 text-slate-800";
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-200";
                  } else if (isSelected && !isCorrect) {
                    btnStyle = "bg-rose-50 border-2 border-rose-400 text-rose-950 font-bold";
                  } else {
                    btnStyle = "bg-slate-50 border-2 border-slate-200 opacity-60 text-slate-600";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`btn-pop w-full p-3.5 rounded-2xl flex items-center justify-between text-left text-sm transition-all ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                        isAnswered && isCorrect
                          ? 'bg-emerald-500 text-white'
                          : isAnswered && isSelected && !isCorrect
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {optionLetter}
                      </span>
                      <span className="font-bold text-sm">{opt}</span>
                    </div>

                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {submitError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-800">{submitError}</p>}

            {/* Feedback Message */}
            {isAnswered && (
              <div className={`p-4 rounded-2xl text-xs font-bold space-y-1 animate-float ${
                selectedOption === currentQ.correctIndex
                  ? 'bg-emerald-100/90 text-emerald-950 border border-emerald-300'
                  : 'bg-amber-100/90 text-amber-950 border border-amber-300'
              }`}>
                <div className="font-black text-sm flex items-center gap-1.5">
                  {selectedOption === currentQ.correctIndex ? (
                    <>
                      <span>✅ Correct!</span>
                    </>
                  ) : (
                    <>
                      <span>❌ Not quite!</span>
                    </>
                  )}
                </div>
                <p className="font-medium text-xs">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <div className="pt-2">
                <button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="btn-pop w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-sm border-2 border-emerald-300 disabled:opacity-60"
                >
                  <span>{isSubmitting ? 'SAVING QUIZ...' : currentIdx < totalQ - 1 ? 'NEXT QUESTION' : 'VIEW SCORE & REWARDS'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Quiz Results View */
          <div className="p-8 text-center space-y-5">
            <div className="text-6xl animate-bounce">
              {score === totalQ ? '🏆' : '⭐'}
            </div>

            <div className="space-y-1">
              <span className="bg-amber-100 text-amber-950 font-black text-xs uppercase px-3 py-1 rounded-full border border-amber-300 inline-block">
                QUIZ COMPLETE! 🎉
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                {score === totalQ ? 'Perfect Score, Earth Hero!' : 'Great SDG Explorer!'}
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                You just leveled up your sustainability knowledge for SDG {lesson.sdgNumber}!
              </p>
            </div>

            {/* Score & Reward Badge */}
            <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 p-5 rounded-3xl border-2 border-amber-200 max-w-sm mx-auto space-y-3">
              <div className="flex items-center justify-around">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Your Score</div>
                  <div className="text-3xl font-black text-slate-900">{score} / {totalQ}</div>
                </div>

                <div className="h-10 w-px bg-amber-200" />

                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase">XP Rewarded</div>
                  <div className="text-3xl font-black text-emerald-600">+{earnedXp} ⭐</div>
                </div>
              </div>

              {score === totalQ && (
                <div className="text-xs font-black text-amber-800 bg-amber-200/60 py-1 px-3 rounded-full">
                  🌟 +10 Bonus XP for 100% Perfect Score!
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleRestart}
                className="btn-pop w-full sm:flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>TRY AGAIN</span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  onClose();
                  if (onStartMission) onStartMission(lesson.missionId);
                }}
                className="btn-pop w-full sm:flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-3 rounded-2xl shadow-lg border-2 border-emerald-300 text-xs flex items-center justify-center gap-1.5"
              >
                <span>START MISSION NOW 🎯</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
