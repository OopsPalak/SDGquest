import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Grid, Sparkles, Volume2 } from 'lucide-react';
import { BookCover } from './BookCover.jsx';
import { BookPage } from './BookPage.jsx';
import { playClickSound, playPageFlipSound } from '../../../audio/soundFx.js';

export function BookView({ bookPages = [], childName = 'Leo', onBackToHome }) {
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
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* Header controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { playClickSound(); onBackToHome(); }}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-100 transition-colors"
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
            setIsOpen(true);
          }}
        />
      ) : (
        <div className="space-y-6">
          {/* Top Bar Page Jumper Pills */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-2 overflow-x-auto">
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

            <div className="text-xs font-black text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {bookPages.length} / 30 Pages Collected 🌟
            </div>
          </div>

          {/* Interactive Flipbook Page Container */}
          <div className="relative bg-amber-900 p-4 sm:p-6 rounded-3xl shadow-2xl border-8 border-amber-800 book-shadow">
            {/* Left/Right Spine Shadow effect */}
            <div className="absolute inset-y-0 left-0 w-8 page-spine rounded-l-2xl pointer-events-none z-10" />

            {/* Current Page Content */}
            {bookPages.length > 0 ? (
              <BookPage
                pageData={bookPages[currentPageIndex]}
                pageNumber={currentPageIndex + 1}
                totalPages={bookPages.length}
              />
            ) : (
              <div className="bg-amber-50 p-12 rounded-2xl text-center space-y-3">
                <span className="text-6xl">📖</span>
                <h3 className="text-2xl font-black text-amber-950">Your Book is Waiting for your First Story!</h3>
                <p className="text-xs text-amber-800 font-medium max-w-md mx-auto">
                  Complete your first real-world SDG mission to create a personalized page in your storybook!
                </p>
              </div>
            )}
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
        </div>
      )}
    </div>
  );
}
