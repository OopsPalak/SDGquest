import React, { useState } from 'react';
import { User, Sparkles, Check, Save } from 'lucide-react';
import { AVATAR_OPTIONS } from '../../utils/constants.js';
import { playClickSound, playSuccessSound } from '../../audio/soundFx.js';

export function AvatarBuilder({ childProfile, onSaveAvatar }) {
  const [avatar, setAvatar] = useState(childProfile?.avatar || {
    skin: '#FFD1A4',
    hair: '#8D5B4C',
    style: 'Short Curly',
    outfit: 'Water Guardian Hoodie',
    accessory: 'Eco Backpack 🎒'
  });
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = () => {
    playSuccessSound();
    onSaveAvatar(avatar);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto px-4 pt-4">
      <div className="text-center space-y-1">
        <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-900 text-xs font-black uppercase px-3 py-1 rounded-full border border-indigo-300">
          👦 CUSTOM AVATAR
        </span>
        <h1 className="text-3xl font-black text-slate-900">
          Eco Explorer Avatar
        </h1>
        <p className="text-xs text-slate-600 font-medium">
          Customize your character! Complete missions to unlock SDG-themed accessories.
        </p>
      </div>

      {/* Main Avatar Preview Display */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xl flex flex-col sm:flex-row items-center justify-around gap-6">
        <div className="relative flex flex-col items-center">
          <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-sky-200 via-teal-100 to-emerald-200 border-4 border-white shadow-xl flex items-center justify-center text-8xl relative overflow-hidden">
            {/* Render customizable avatar preview */}
            <span className="animate-float">👦</span>
            <span className="absolute bottom-2 right-2 text-3xl">{avatar.accessory.split(' ')[1] || '🎒'}</span>
          </div>

          <div className="mt-3 text-center">
            <h3 className="font-black text-slate-900 text-lg">{childProfile?.name || 'Leo'}</h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 inline-block mt-1">
              Level {childProfile?.level || 2} • {avatar.outfit}
            </span>
          </div>
        </div>

        {/* Avatar Customization Options */}
        <div className="w-full max-w-md space-y-4">
          {/* Skin Tone */}
          <div>
            <label className="text-xs font-black uppercase text-slate-500 tracking-wider mb-1.5 block">
              Skin Tone
            </label>
            <div className="flex items-center gap-2">
              {AVATAR_OPTIONS.skin.map((c) => (
                <button
                  key={c}
                  onClick={() => { playClickSound(); setAvatar({ ...avatar, skin: c }); }}
                  style={{ backgroundColor: c }}
                  className={`w-8 h-8 rounded-full border-2 ${
                    avatar.skin === c ? 'ring-2 ring-slate-900 scale-110 border-white' : 'border-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Outfit */}
          <div>
            <label className="text-xs font-black uppercase text-slate-500 tracking-wider mb-1.5 block">
              Eco Outfit
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AVATAR_OPTIONS.outfit.map((o) => (
                <button
                  key={o}
                  onClick={() => { playClickSound(); setAvatar({ ...avatar, outfit: o }); }}
                  className={`p-2.5 rounded-xl text-xs font-bold border text-left transition-all ${
                    avatar.outfit === o
                      ? 'bg-slate-900 text-white shadow-md border-slate-900'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          {/* SDG Accessories */}
          <div>
            <label className="text-xs font-black uppercase text-slate-500 tracking-wider mb-1.5 block">
              Unlocked Gear & Accessories
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AVATAR_OPTIONS.accessories.map((a) => (
                <button
                  key={a}
                  onClick={() => { playClickSound(); setAvatar({ ...avatar, accessory: a }); }}
                  className={`p-2.5 rounded-xl text-xs font-bold border text-left transition-all ${
                    avatar.accessory === a
                      ? 'bg-amber-400 text-amber-950 shadow-md border-amber-300'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="btn-pop w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 rounded-2xl shadow-md flex items-center justify-center gap-2 text-sm"
          >
            {savedMessage ? (
              <>
                <Check className="w-5 h-5 text-emerald-200" />
                <span>AVATAR SAVED! ✨</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>SAVE AVATAR LOOK</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
