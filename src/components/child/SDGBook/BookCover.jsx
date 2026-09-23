import React from 'react';
import { Sparkles, BookOpen } from 'lucide-react';
import { playClickSound } from '../../../audio/soundFx.js';

export function BookCover({ childName = 'Leo', totalPages = 3, onOpen }) {
  return (
    <div
      onClick={() => { playClickSound(); onOpen(); }}
      className="btn-pop cursor-pointer relative max-w-lg mx-auto aspect-[3/4] rounded-3xl bg-gradient-to-tr from-amber-600 via-yellow-600 to-amber-700 p-8 text-amber-50 shadow-2xl border-8 border-amber-300 flex flex-col justify-between overflow-hidden book-shadow group"
    >
      {/* Gold foil decorative border */}
      <div className="absolute inset-4 border-2 border-amber-300/60 rounded-2xl pointer-events-none" />

      {/* Floating Sparkles & Emojis */}
      <div className="absolute top-8 right-8 text-4xl animate-bounce">
        ✨
      </div>
      <div className="absolute bottom-8 left-8 text-4xl animate-float">
        🌎
      </div>

      {/* Book Title Header */}
      <div className="text-center pt-8 space-y-2 relative z-10">
        <div className="inline-flex items-center gap-1.5 bg-amber-950/40 text-amber-200 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-amber-300/40 backdrop-blur-sm">
          <span>📖</span>
          <span>Official SDG Scrapbook</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-amber-100 tracking-tight drop-shadow-md font-outfit mt-4">
          MY SDG JOURNEY
        </h1>
        <p className="text-amber-200 font-handwriting text-2xl">
          Created with Love & Eco-Action
        </p>
      </div>

      {/* Middle Custom Illustration Badge */}
      <div className="relative z-10 flex flex-col items-center my-auto">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 p-2 shadow-2xl border-4 border-amber-100 group-hover:scale-110 transition-transform">
          <div className="w-full h-full rounded-full bg-amber-900 flex items-center justify-center text-6xl">
            🌱
          </div>
        </div>

        <div className="mt-4 bg-amber-950/60 backdrop-blur-md px-6 py-2 rounded-2xl border border-amber-300/50 text-center">
          <span className="text-xs font-bold text-amber-300 uppercase block">Explorer Name</span>
          <span className="text-2xl font-black text-amber-100">{childName}</span>
        </div>
      </div>

      {/* Footer Call to Action */}
      <div className="relative z-10 text-center pb-4">
        <div className="inline-flex items-center gap-2 bg-amber-300 text-amber-950 font-black px-6 py-3 rounded-full text-base shadow-lg group-hover:bg-white transition-colors">
          <BookOpen className="w-5 h-5" />
          <span>TAP TO OPEN MY BOOK ({totalPages} Pages)</span>
        </div>
      </div>
    </div>
  );
}
