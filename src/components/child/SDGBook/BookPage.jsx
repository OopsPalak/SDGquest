import React from 'react';
import { Sparkles, Calendar, Award, Star } from 'lucide-react';
import { SDGS_DATA, FRAMES } from '../../../utils/constants.js';

export function BookPage({ pageData, pageNumber, totalPages }) {
  if (!pageData) return null;

  // Find SDG metadata for theme
  const sdg = SDGS_DATA.find(s => s.id === pageData.sdgId || s.number === pageData.sdgNumber) || SDGS_DATA[0];
  const frameObj = FRAMES.find(f => f.id === pageData.frame) || FRAMES[0];

  return (
    <div className="relative w-full h-full min-h-[480px] bg-amber-50/70 p-6 rounded-2xl border border-amber-200 shadow-inner flex flex-col justify-between overflow-hidden">
      {/* Background Subtle SDG Theme Watermark */}
      <div className="absolute -right-8 -top-8 text-9xl opacity-10 select-none pointer-events-none">
        {sdg.icon}
      </div>

      <div>
        {/* Page Top Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-amber-200 mb-4">
          <div className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-xl ${sdg.bgColor} text-white font-black text-sm flex items-center justify-center shadow`}>
              {sdg.icon}
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                SDG {sdg.number} • {sdg.title}
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {pageData.title}
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{pageData.date || 'Sept 2026'}</span>
            </span>
          </div>
        </div>

        {/* Center Scrapbook Photo / Drawing Display */}
        <div className="flex flex-col items-center my-3">
          <div className={`relative max-w-sm w-full rounded-2xl p-2 bg-white ${frameObj.border} shadow-md transition-all`}>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={pageData.mediaUrl}
                alt={pageData.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Sticker overlays */}
            <div className="absolute -top-3 -right-3 flex items-center gap-1 pointer-events-none">
              {pageData.stickers && pageData.stickers.map((s, idx) => (
                <span key={idx} className="text-3xl filter drop-shadow">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Caption handwritten note */}
          <div className="mt-4 bg-white/90 p-4 rounded-2xl border border-amber-200 w-full text-center shadow-sm">
            <p className="font-handwriting text-xl text-slate-800 leading-snug">
              "{pageData.caption}"
            </p>
            <p className="text-[11px] font-bold text-amber-800 mt-1">
              — Completed by {pageData.author || 'Leo'} 🌱
            </p>
          </div>
        </div>
      </div>

      {/* Page Footer Rewards & Number */}
      <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-100 text-emerald-800 font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
            ⭐ +{pageData.xpEarned || 50} XP
          </span>
          <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
            <span>🏅</span>
            <span>{pageData.badgeName || 'SDG Achiever'}</span>
          </span>
        </div>

        <span className="font-bold text-slate-400">
          Page {pageNumber} of {totalPages}
        </span>
      </div>
    </div>
  );
}
