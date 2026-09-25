import React, { useState } from 'react';
import { User, Sparkles, Check, Save, Lock, Smile, Shirt, Backpack, Shield, Palette } from 'lucide-react';
import { AvatarDisplay } from './AvatarDisplay.jsx';
import { playClickSound, playSuccessSound } from '../../audio/soundFx.js';

// Configuration definitions for the layered character
const SKIN_TONES = [
  { id: '#FFD1A4', label: 'Peach Warm' },
  { id: '#FFDBAC', label: 'Golden Sand' },
  { id: '#E0A899', label: 'Rosy Tan' },
  { id: '#9F685B', label: 'Rich Chestnut' },
  { id: '#5A3D31', label: 'Deep Espresso' }
];

const EXPRESSIONS = [
  { id: 'happy', label: 'Cheerful Sparkle', desc: 'Friendly open smile with bright eyes' },
  { id: 'grin', label: 'Explorer Grin', desc: 'Adventurous big toothy smile' },
  { id: 'wink', label: 'Confident Wink', desc: 'Cheeky winking eco hero' },
  { id: 'curious', label: 'Curious Wonder', desc: 'Observant eyes ready to learn' }
];

const HAIR_STYLES = [
  { id: 'short_curly', label: 'Short Curly', desc: 'Textured playful curls' },
  { id: 'spiky', label: 'Sporty Spikes', desc: 'Energetic outdoor spikes' },
  { id: 'ponytail', label: 'Scout Ponytail', desc: 'Tied back with green ribbon' },
  { id: 'wavy', label: 'Wavy Locks', desc: 'Flowing shoulder-length hair' },
  { id: 'cap_bangs', label: 'Adventurer Cap', desc: 'Green field cap with bangs' }
];

const HAIR_COLORS = [
  { id: '#2C1A1D', label: 'Ebony Black' },
  { id: '#6A381F', label: 'Warm Chestnut' },
  { id: '#D4A373', label: 'Honey Blonde' },
  { id: '#A83220', label: 'Auburn Fox' },
  { id: '#1B4965', label: 'Eco Teal/Navy' }
];

const OUTFITS = [
  { id: 'eco_tee', label: 'Eco Adventurer Tee', desc: 'Organic cotton white & green leaf tee', requiredBadge: null },
  { id: 'water_hoodie', label: 'Water Guardian Hoodie', desc: 'Cyan & royal blue water droplet hoodie', requiredBadge: 'water_saver', badgeHint: 'Water Saver Badge' },
  { id: 'forest_vest', label: 'Forest Scout Vest', desc: 'Deep emerald scout vest with utility pockets', requiredBadge: 'nature_protector', badgeHint: 'Nature Protector Badge' },
  { id: 'solar_jacket', label: 'Solar Ranger Jacket', desc: 'Sunburst orange zip windbreaker', requiredBadge: 'climate_explorer', badgeHint: 'Climate Explorer Badge' },
  { id: 'climate_coat', label: 'Earth Guardian Coat', desc: 'Sky & teal dual-tone atmospheric coat', requiredBadge: null }
];

const ACCESSORIES = [
  { id: 'none', label: 'No Accessory', desc: 'Clean explorer look', requiredBadge: null },
  { id: 'eco_backpack', label: 'Explorer Backpack', desc: 'Sturdy amber pack with shoulder straps', requiredBadge: null },
  { id: 'round_glasses', label: 'Round Eco Glasses', desc: 'Recycled brass green-rim spectacles', requiredBadge: null },
  { id: 'cool_shades', label: 'Sun Field Shades', desc: 'Polarized protective UV sunglasses', requiredBadge: null }
];

const SDG_ITEMS = [
  { id: 'none', label: 'No Item Equipped', desc: 'Bare hands', requiredBadge: null },
  { id: 'water_flask', label: 'Hydro Flask 💧', desc: 'Stainless reusable clean water bottle', requiredBadge: 'water_saver', badgeHint: 'Complete Water Mission' },
  { id: 'nature_sprout', label: 'Sprout Seed Wand 🌿', desc: 'Green blooming seedling wand', requiredBadge: 'nature_protector', badgeHint: 'Complete Nature Mission' },
  { id: 'solar_compass', label: 'Sun Compass ⚡', desc: 'Golden solar navigator compass', requiredBadge: 'climate_explorer', badgeHint: 'Complete Climate Mission' },
  { id: 'recycle_badge', label: 'Recycle Loop Pin ♻️', desc: 'Glowing triple-arrow chest insignia', requiredBadge: 'waste_warrior', badgeHint: 'Complete Recycling Mission' }
];

export function AvatarBuilder({ childProfile, onSaveAvatar }) {
  const unlockedBadges = childProfile?.unlockedBadges || [];

  // Active Category Tab
  const [activeCategory, setActiveCategory] = useState('face'); // 'face' | 'hair' | 'outfit' | 'accessories' | 'sdg'

  // Live Avatar State (defaults cleanly to current childProfile.avatar)
  const [avatar, setAvatar] = useState({
    skin: childProfile?.avatar?.skin || '#FFD1A4',
    expression: childProfile?.avatar?.expression || 'happy',
    hairStyle: childProfile?.avatar?.hairStyle || 'short_curly',
    hairColor: childProfile?.avatar?.hairColor || '#6A381F',
    outfit: childProfile?.avatar?.outfit || 'eco_tee',
    accessory: childProfile?.avatar?.accessory || 'eco_backpack',
    sdgItem: childProfile?.avatar?.sdgItem || 'none'
  });

  const [savedFeedback, setSavedFeedback] = useState(false);

  // Live Updater Helper
  const updateAvatarField = (field, value, requiredBadge) => {
    if (requiredBadge && !unlockedBadges.includes(requiredBadge)) {
      // Locked item tapped
      playClickSound();
      return;
    }

    playSuccessSound();
    const updated = { ...avatar, [field]: value };
    setAvatar(updated);
    
    // Auto-propagate immediately to keep state synchronized across pages
    if (onSaveAvatar) {
      onSaveAvatar(updated);
    }
  };

  const handleManualSave = () => {
    playSuccessSound();
    if (onSaveAvatar) {
      onSaveAvatar(avatar);
    }
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2200);
  };

  return (
    <div className="space-y-6 pb-28 max-w-4xl mx-auto px-4 pt-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-black uppercase px-3 py-1 rounded-full border border-emerald-300">
          <User className="w-3.5 h-3.5" />
          <span>MY AVATAR DASHBOARD</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Customize Your SDG Explorer
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto">
          Mix and match hairstyles, outfits, and gear. Complete real-world missions to unlock exclusive SDG items!
        </p>
      </div>

      {/* Main Avatar Workspace (Split on Desktop, Stacked on Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: LIVE AVATAR PREVIEW CARD */}
        <div className="lg:col-span-5 bg-white/95 rounded-3xl p-6 border-2 border-slate-200 shadow-xl flex flex-col items-center justify-between text-center sticky top-20">
          
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Live Preview</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Level {childProfile?.level || 1} Explorer
            </span>
          </div>

          {/* Large Illustrated Layered Avatar */}
          <div className="my-4 relative">
            {/* Background Soft Aura Ring */}
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-emerald-100 via-sky-100 to-teal-100 absolute -top-2 -left-2 sm:-left-3 blur-sm" />
            
            {/* Layered Avatar Component */}
            <AvatarDisplay avatar={avatar} size="xl" animated={true} />
          </div>

          {/* Character Label */}
          <div className="mt-2 space-y-1">
            <h2 className="text-2xl font-black text-slate-900">{childProfile?.name || 'Explorer'}</h2>
            <p className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300 inline-block">
              {childProfile?.levelName || 'SDG Explorer'}
            </p>
          </div>

          {/* Save Button */}
          <div className="w-full pt-6">
            <button
              onClick={handleManualSave}
              className="btn-pop w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-3.5 rounded-2xl shadow-lg border-2 border-emerald-300 text-sm flex items-center justify-center gap-2"
            >
              {savedFeedback ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>AVATAR LOOK SAVED! ✨</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>SAVE MY AVATAR LOOK</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE CUSTOMIZATION CATEGORIES */}
        <div className="lg:col-span-7 bg-white/95 rounded-3xl p-6 border-2 border-slate-200 shadow-xl space-y-5">
          
          {/* Category Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto">
            <button
              onClick={() => { playClickSound(); setActiveCategory('face'); }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeCategory === 'face'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smile className="w-4 h-4 text-emerald-600" />
              <span>Face</span>
            </button>

            <button
              onClick={() => { playClickSound(); setActiveCategory('hair'); }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeCategory === 'hair'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Palette className="w-4 h-4 text-indigo-600" />
              <span>Hair</span>
            </button>

            <button
              onClick={() => { playClickSound(); setActiveCategory('outfit'); }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeCategory === 'outfit'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shirt className="w-4 h-4 text-sky-600" />
              <span>Outfit</span>
            </button>

            <button
              onClick={() => { playClickSound(); setActiveCategory('accessories'); }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeCategory === 'accessories'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Backpack className="w-4 h-4 text-amber-600" />
              <span>Gear</span>
            </button>

            <button
              onClick={() => { playClickSound(); setActiveCategory('sdg'); }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeCategory === 'sdg'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>SDG Items</span>
            </button>
          </div>

          {/* 1. FACE TAB: Skin Tone & Expressions */}
          {activeCategory === 'face' && (
            <div className="space-y-5">
              {/* Skin Tones */}
              <div>
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider mb-2 block">
                  1. Skin Tone (Tap to apply)
                </label>
                <div className="flex items-center gap-3">
                  {SKIN_TONES.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => updateAvatarField('skin', st.id)}
                      className={`w-11 h-11 rounded-2xl border-4 transition-all shadow-sm ${
                        avatar.skin === st.id
                          ? 'ring-4 ring-emerald-400 scale-110 border-white'
                          : 'border-white hover:scale-105'
                      }`}
                      style={{ backgroundColor: st.id }}
                      title={st.label}
                    />
                  ))}
                </div>
              </div>

              {/* Facial Expressions */}
              <div>
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider mb-2 block">
                  2. Face Expression
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {EXPRESSIONS.map((exp) => (
                    <button
                      key={exp.id}
                      onClick={() => updateAvatarField('expression', exp.id)}
                      className={`btn-pop p-3 rounded-2xl border-2 text-left transition-all ${
                        avatar.expression === exp.id
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm">{exp.label}</span>
                        {avatar.expression === exp.id && (
                          <Check className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{exp.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. HAIR TAB: Styles & Colors */}
          {activeCategory === 'hair' && (
            <div className="space-y-5">
              {/* Hair Colors */}
              <div>
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider mb-2 block">
                  Hair Color
                </label>
                <div className="flex items-center gap-3">
                  {HAIR_COLORS.map((hc) => (
                    <button
                      key={hc.id}
                      onClick={() => updateAvatarField('hairColor', hc.id)}
                      className={`w-11 h-11 rounded-2xl border-4 transition-all shadow-sm ${
                        avatar.hairColor === hc.id
                          ? 'ring-4 ring-indigo-400 scale-110 border-white'
                          : 'border-white hover:scale-105'
                      }`}
                      style={{ backgroundColor: hc.id }}
                      title={hc.label}
                    />
                  ))}
                </div>
              </div>

              {/* Hair Styles */}
              <div>
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider mb-2 block">
                  Hairstyle
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {HAIR_STYLES.map((hs) => (
                    <button
                      key={hs.id}
                      onClick={() => updateAvatarField('hairStyle', hs.id)}
                      className={`btn-pop p-3 rounded-2xl border-2 text-left transition-all ${
                        avatar.hairStyle === hs.id
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm">{hs.label}</span>
                        {avatar.hairStyle === hs.id && (
                          <Check className="w-4 h-4 text-indigo-600" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{hs.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. OUTFIT TAB */}
          {activeCategory === 'outfit' && (
            <div className="space-y-3">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider mb-1 block">
                Choose Explorer Outfit
              </label>

              <div className="space-y-2.5">
                {OUTFITS.map((out) => {
                  const isLocked = out.requiredBadge && !unlockedBadges.includes(out.requiredBadge);
                  const isSelected = avatar.outfit === out.id;

                  return (
                    <button
                      key={out.id}
                      disabled={isLocked}
                      onClick={() => updateAvatarField('outfit', out.id, out.requiredBadge)}
                      className={`btn-pop w-full p-3.5 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-sky-50 border-sky-500 text-sky-950 font-bold shadow-sm'
                          : isLocked
                          ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm">{out.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-sky-600" />}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{out.desc}</p>
                      </div>

                      {isLocked && (
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                            <Lock className="w-3 h-3" />
                            <span>{out.badgeHint}</span>
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. ACCESSORIES TAB */}
          {activeCategory === 'accessories' && (
            <div className="space-y-3">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider mb-1 block">
                Field Gear & Accessories
              </label>

              <div className="space-y-2.5">
                {ACCESSORIES.map((acc) => {
                  const isSelected = avatar.accessory === acc.id;

                  return (
                    <button
                      key={acc.id}
                      onClick={() => updateAvatarField('accessory', acc.id)}
                      className={`btn-pop w-full p-3.5 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm">{acc.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-amber-600" />}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{acc.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. SPECIAL UNLOCKED SDG ITEMS TAB */}
          {activeCategory === 'sdg' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase text-emerald-800 tracking-wider block">
                  ✨ Special SDG Explorer Items
                </label>
                <span className="text-[10px] font-bold text-slate-500">Unlocked via missions & badges</span>
              </div>

              <div className="space-y-2.5">
                {SDG_ITEMS.map((item) => {
                  const isLocked = item.requiredBadge && !unlockedBadges.includes(item.requiredBadge);
                  const isSelected = avatar.sdgItem === item.id;

                  return (
                    <button
                      key={item.id}
                      disabled={isLocked}
                      onClick={() => updateAvatarField('sdgItem', item.id, item.requiredBadge)}
                      className={`btn-pop w-full p-3.5 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-sm'
                          : isLocked
                          ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm">{item.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                      </div>

                      {isLocked ? (
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                            <Lock className="w-3 h-3" />
                            <span>{item.badgeHint}</span>
                          </span>
                        </div>
                      ) : (
                        item.requiredBadge && (
                          <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            UNLOCKED ✨
                          </span>
                        )
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
