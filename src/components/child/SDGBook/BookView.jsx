import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Grid, Sparkles, Volume2 } from 'lucide-react';
import { BookCover } from './BookCover.jsx';
import { BookPage } from './BookPage.jsx';
import { playClickSound, playPageFlipSound } from '../../../audio/soundFx.js';

export function BookView({ bookPages = [], childName = 'Explorer', onBackToHome, onNavigateToMissions }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const handleNextPage = () => {
    if (currentPageIndex < bookPages.length - 1) {
      playPageFlipSound();
      setCurrentPageIndex(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      playPageFlipSound();
      setCurrentPageIndex(prev => prev - 1);
    }
  };

  const jumpToPage = (idx) => {
    playPageFlipSound();
    setCurrentPageIndex(idx);
  };

  return (
    <div className="space-y-6 pb-28 max-w-4xl mx-auto px-4 pt-4">
      {/* Header controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { playClickSound(); onBackToHome(); }}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white/95 px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home Dashboard</span>
        </button>

        {isOpen && (
          <button
            onClick={() => { playClickSound(); setIsOpen(false); }}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 px-3.5 py-2 rounded-xl border border-amber-300 shadow-sm hover:bg-amber-200 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Close to Cover</span>
          </button>
        )}
      </div>

      {/* Book Experience Wrapper */}
      {!isOpen ? (
        <BookCover
          childName={childName}
          totalPages={bookPages.length}
          onOpen={() => {
            playPageFlipSound();
            if (bookPages.length === 0 && onNavigateToMissions) {
              onNavigateToMissions();
            } else {
              setIsOpen(true);
            }
          }}
        />
      ) : (
        <div className="space-y-6">
          {bookPages.length > 0 ? (
            <>
              {/* Top Bar Page Jumper Pills */}
              <div className="bg-white/95 p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-2 overflow-x-auto">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-500 uppercase">Pages:</span>
                  {bookPages.map((page, idx) => (
                    <button
                      key={page.id}
                      onClick={() => jumpToPage(idx)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        currentPageIndex === idx
                          ? 'bg-amber-500 text-white shadow scale-105'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Page {idx + 1}
                    </button>
                  ))}
                </div>

                <div className="text-xs font-black text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 whitespace-nowrap">
                  {bookPages.length} Collected Pages 🌟
                </div>
              </div>

              {/* Interactive Flipbook Page Container */}
              <div className="relative bg-amber-900 p-4 sm:p-6 rounded-3xl shadow-2xl border-8 border-amber-800 book-shadow">
                {/* Left/Right Spine Shadow effect */}
                <div className="absolute inset-y-0 left-0 w-8 page-spine rounded-l-2xl pointer-events-none z-10" />

                {/* Current Page Content */}
                <BookPage
                  pageData={bookPages[currentPageIndex]}
                  pageNumber={currentPageIndex + 1}
                  totalPages={bookPages.length}
                />
              </div>

              {/* Bottom Flip Navigation Buttons */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPageIndex === 0}
                  className={`btn-pop flex-1 py-3.5 rounded-2xl font-black text-sm shadow-md flex items-center justify-center gap-2 border-2 ${
                    currentPageIndex === 0
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Previous Page</span>
                </button>

                <span className="font-black text-sm text-slate-700 hidden sm:inline">
                  {currentPageIndex + 1} of {bookPages.length}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={currentPageIndex >= bookPages.length - 1}
                  className={`btn-pop flex-1 py-3.5 rounded-2xl font-black text-sm shadow-md flex items-center justify-center gap-2 border-2 ${
                    currentPageIndex >= bookPages.length - 1
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      : 'bg-amber-400 text-amber-950 border-amber-300 hover:bg-amber-300'
                  }`}
                >
                  <span>Next Page</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            /* Empty Book State for New User (Requirement 12) */
            <div className="bg-white/95 rounded-3xl p-10 sm:p-12 text-center border-4 border-amber-200 shadow-xl space-y-4 max-w-lg mx-auto">
              <span className="text-7xl block animate-float">📖🌱</span>
              <div className="space-y-1">
                <h3 className="text-2xl sm:text-3xl font-black text-amber-950">
                  MY SDG JOURNEY
                </h3>
                <p className="text-base text-amber-900 font-bold">
                  “Your book is waiting for its first adventure!”
                </p>
                <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto pt-1">
                  Complete your first real-world mission and submit a photo or drawing to create your personalized storybook page!
                </p>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => {
                    playClickSound();
                    if (onNavigateToMissions) onNavigateToMissions();
                  }}
                  className="btn-pop bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black px-7 py-3.5 rounded-2xl shadow-lg border-2 border-emerald-300 text-sm flex items-center justify-center gap-2 mx-auto"
                >
                  <span>START FIRST MISSION →</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
