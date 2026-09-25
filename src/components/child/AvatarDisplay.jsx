import React from 'react';

/**
 * Layered SVG Avatar Component for SDG Quest Explorers
 * Dynamically renders:
 * 1. Back Accessories (e.g. Backpack body/straps)
 * 2. Body base, neck, ears, and head with customizable skin tone
 * 3. Face Expression (Eyes, catchlights, eyebrows, cheeks, smile)
 * 4. Hair style and hair color
 * 5. Outfits (Eco Adventurer Tee, Water Guardian Hoodie, Forest Scout Vest, Solar Ranger Jacket, Earth Guardian Coat)
 * 6. Front Accessories (Glasses, caps, backpack straps)
 * 7. SDG-themed handheld / chest items (Water Flask, Leaf Sprout Pin, Sun Compass, Recycle Kit)
 */
export function AvatarDisplay({
  avatar = {},
  size = 'lg', // 'sm' | 'md' | 'lg' | 'xl'
  animated = true,
  className = ''
}) {
  const {
    skin = '#FFD1A4',
    expression = 'happy', // 'happy' | 'grin' | 'wink' | 'curious'
    hairStyle = 'short_curly', // 'short_curly' | 'spiky' | 'ponytail' | 'wavy' | 'cap_bangs'
    hairColor = '#6A381F', // '#2C1A1D' | '#6A381F' | '#D4A373' | '#A83220' | '#1B4965'
    outfit = 'eco_tee', // 'eco_tee' | 'water_hoodie' | 'forest_vest' | 'solar_jacket' | 'climate_coat'
    accessory = 'none', // 'none' | 'eco_backpack' | 'round_glasses' | 'cool_shades' | 'explorer_cap'
    sdgItem = 'none' // 'none' | 'water_flask' | 'nature_sprout' | 'solar_compass' | 'recycle_badge'
  } = avatar;

  // Size mapping
  const sizeClasses = {
    xs: 'w-8 h-9',
    sm: 'w-12 h-14',
    md: 'w-20 h-24',
    lg: 'w-44 h-52 sm:w-48 sm:h-56',
    xl: 'w-56 h-64 sm:w-64 sm:h-72'
  };

  return (
    <div
      className={`relative select-none inline-flex items-center justify-center ${sizeClasses[size] || sizeClasses.lg} ${
        animated ? 'animate-float' : ''
      } ${className}`}
    >
      <svg
        viewBox="0 0 200 240"
        className="w-full h-full drop-shadow-md overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle drop shadow filter for layered depth */}
          <filter id="layerShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.15" />
          </filter>

          {/* Gradients for Outfits */}
          <linearGradient id="waterHoodieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          <linearGradient id="forestVestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          <linearGradient id="solarJacketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          <linearGradient id="climateCoatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>

          <linearGradient id="ecoTeeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#ecfdf5" />
          </linearGradient>

          <linearGradient id="backpackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          <linearGradient id="hairHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* ---------------- 1. BACK ACCESSORY: BACKPACK ---------------- */}
        {(accessory === 'eco_backpack' || accessory === 'Eco Backpack 🎒' || accessory.includes('Backpack')) && (
          <g id="back_backpack" filter="url(#layerShadow)">
            <rect x="52" y="118" width="96" height="85" rx="20" fill="url(#backpackGrad)" stroke="#78350f" strokeWidth="2.5" />
            {/* Top handle loop */}
            <path d="M85 118 V105 Q100 100 115 105 V118" fill="none" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
            {/* Side pockets */}
            <rect x="42" y="145" width="14" height="42" rx="6" fill="#d97706" stroke="#78350f" strokeWidth="2" />
            <rect x="144" y="145" width="14" height="42" rx="6" fill="#d97706" stroke="#78350f" strokeWidth="2" />
          </g>
        )}

        {/* ---------------- 2. BASE BODY & HEAD ---------------- */}
        <g id="base_body">
          {/* Neck */}
          <rect x="88" y="115" width="24" height="28" rx="6" fill={skin} stroke="#000000" strokeOpacity="0.08" strokeWidth="1" />
          <path d="M88 126 Q100 134 112 126" fill="none" stroke="#000000" strokeOpacity="0.12" strokeWidth="2" />

          {/* Shoulders / Upper Body Base */}
          <path
            d="M55 175 Q62 135 90 135 L110 135 Q138 135 145 175 L148 230 L52 230 Z"
            fill={skin}
          />

          {/* Ears */}
          <circle cx="56" cy="88" r="10" fill={skin} stroke="#000000" strokeOpacity="0.06" strokeWidth="1" />
          <circle cx="56" cy="88" r="5" fill="#000000" fillOpacity="0.08" />

          <circle cx="144" cy="88" r="10" fill={skin} stroke="#000000" strokeOpacity="0.06" strokeWidth="1" />
          <circle cx="144" cy="88" r="5" fill="#000000" fillOpacity="0.08" />

          {/* Head Base */}
          <ellipse cx="100" cy="84" rx="44" ry="46" fill={skin} />
        </g>

        {/* ---------------- 3. FACE EXPRESSIONS ---------------- */}
        <g id="face_expression">
          {/* Soft Cheek Blush */}
          <circle cx="72" cy="94" r="8" fill="#f43f5e" fillOpacity="0.22" />
          <circle cx="128" cy="94" r="8" fill="#f43f5e" fillOpacity="0.22" />

          {/* Eyebrows */}
          {expression === 'curious' ? (
            <>
              <path d="M70 66 Q80 62 90 68" fill="none" stroke={hairColor} strokeWidth="3.5" strokeLinecap="round" />
              <path d="M110 68 Q120 62 130 64" fill="none" stroke={hairColor} strokeWidth="3.5" strokeLinecap="round" />
            </>
          ) : expression === 'grin' ? (
            <>
              <path d="M70 67 Q80 64 90 68" fill="none" stroke={hairColor} strokeWidth="3.5" strokeLinecap="round" />
              <path d="M110 68 Q120 64 130 67" fill="none" stroke={hairColor} strokeWidth="3.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M70 68 Q80 65 89 69" fill="none" stroke={hairColor} strokeWidth="3.5" strokeLinecap="round" />
              <path d="M111 69 Q120 65 130 68" fill="none" stroke={hairColor} strokeWidth="3.5" strokeLinecap="round" />
            </>
          )}

          {/* Eyes */}
          {expression === 'wink' ? (
            <>
              {/* Left Eye: Winking Smile Curve */}
              <path d="M72 82 Q80 75 88 82" fill="none" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
              {/* Right Eye: Large Open Sparkling Eye */}
              <circle cx="121" cy="82" r="8" fill="#1e293b" />
              <circle cx="123.5" cy="79.5" r="2.8" fill="#ffffff" />
              <circle cx="119" cy="84" r="1.4" fill="#ffffff" />
            </>
          ) : (
            <>
              {/* Left Eye */}
              <circle cx="79" cy="82" r="8" fill="#1e293b" />
              <circle cx="81.5" cy="79.5" r="2.8" fill="#ffffff" />
              <circle cx="77" cy="84" r="1.4" fill="#ffffff" />

              {/* Right Eye */}
              <circle cx="121" cy="82" r="8" fill="#1e293b" />
              <circle cx="123.5" cy="79.5" r="2.8" fill="#ffffff" />
              <circle cx="119" cy="84" r="1.4" fill="#ffffff" />
            </>
          )}

          {/* Cute Nose */}
          <path d="M98 87 Q100 90 102 87" fill="none" stroke="#000000" strokeOpacity="0.25" strokeWidth="2.2" strokeLinecap="round" />

          {/* Mouth */}
          {expression === 'grin' ? (
            <g id="mouth_grin">
              <path d="M85 98 Q100 114 115 98 Z" fill="#b91c1c" stroke="#1e293b" strokeWidth="2" />
              <path d="M87 100 Q100 106 113 100" fill="#ffffff" />
            </g>
          ) : expression === 'curious' ? (
            <ellipse cx="100" cy="101" rx="5" ry="6" fill="#b91c1c" stroke="#1e293b" strokeWidth="2" />
          ) : (
            <path d="M88 98 Q100 110 112 98" fill="#b91c1c" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          )}
        </g>

        {/* ---------------- 4. EYEWEAR ACCESSORIES ---------------- */}
        {(accessory === 'round_glasses' || accessory.includes('Glasses') || accessory === 'Round Eco Glasses') && (
          <g id="accessory_glasses">
            {/* Left rim */}
            <circle cx="79" cy="82" r="13" fill="none" stroke="#10b981" strokeWidth="2.5" />
            {/* Right rim */}
            <circle cx="121" cy="82" r="13" fill="none" stroke="#10b981" strokeWidth="2.5" />
            {/* Center bridge */}
            <path d="M92 82 Q100 79 108 82" fill="none" stroke="#10b981" strokeWidth="2.5" />
            {/* Side frames */}
            <line x1="66" y1="82" x2="56" y2="85" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
            <line x1="134" y1="82" x2="144" y2="85" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
            {/* Lens sheen */}
            <line x1="73" y1="75" x2="77" y2="79" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" />
            <line x1="115" y1="75" x2="119" y2="79" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" />
          </g>
        )}

        {(accessory === 'cool_shades' || accessory.includes('Shades') || accessory.includes('Binoculars') || accessory === 'Cool Shades') && (
          <g id="accessory_shades" filter="url(#layerShadow)">
            <path d="M66 75 L92 75 Q90 92 79 92 Q68 92 66 75 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
            <path d="M108 75 L134 75 Q132 92 121 92 Q110 92 108 75 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
            <line x1="92" y1="78" x2="108" y2="78" stroke="#0f172a" strokeWidth="3" />
            {/* Cool reflection streak */}
            <path d="M70 78 L80 78 L75 88 L68 88 Z" fill="#38bdf8" fillOpacity="0.4" />
            <path d="M112 78 L122 78 L117 88 L110 88 Z" fill="#38bdf8" fillOpacity="0.4" />
          </g>
        )}

        {/* ---------------- 5. OUTFITS ---------------- */}
        <g id="outfit_layer" filter="url(#layerShadow)">
          {/* A. WATER HOODIE (SDG 6) */}
          {(outfit === 'water_hoodie' || outfit.includes('Water') || outfit === 'Water Guardian Hoodie') && (
            <g id="outfit_water_hoodie">
              {/* Main Hoodie Body */}
              <path
                d="M50 178 Q62 135 88 135 L112 135 Q138 135 150 178 L152 238 L48 238 Z"
                fill="url(#waterHoodieGrad)"
                stroke="#1d4ed8"
                strokeWidth="2"
              />
              {/* Hoodie Collar / Neck V */}
              <path d="M84 135 Q100 156 116 135" fill="#1e40af" stroke="#1d4ed8" strokeWidth="2" />
              {/* Drawstring strings */}
              <path d="M92 148 L91 168" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M108 148 L109 168" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="91" cy="170" r="2.5" fill="#f8fafc" />
              <circle cx="109" cy="170" r="2.5" fill="#f8fafc" />
              {/* Center Water Drop Emblem */}
              <circle cx="100" cy="192" r="14" fill="#ffffff" fillOpacity="0.25" />
              <path d="M100 182 Q92 194 100 201 Q108 194 100 182 Z" fill="#ffffff" />
            </g>
          )}

          {/* B. FOREST SCOUT VEST (SDG 15) */}
          {(outfit === 'forest_vest' || outfit.includes('Forest') || outfit === 'Forest Scout Jacket') && (
            <g id="outfit_forest_vest">
              {/* Inner shirt */}
              <path d="M50 178 Q62 135 88 135 L112 135 Q138 135 150 178 L152 238 L48 238 Z" fill="#fef3c7" />
              {/* Vest panels */}
              <path d="M50 178 Q62 135 84 135 L86 238 L48 238 Z" fill="url(#forestVestGrad)" stroke="#065f46" strokeWidth="2" />
              <path d="M150 178 Q138 135 116 135 L114 238 L152 238 Z" fill="url(#forestVestGrad)" stroke="#065f46" strokeWidth="2" />
              {/* Vest pockets */}
              <rect x="56" y="180" width="22" height="26" rx="4" fill="#047857" stroke="#064e3b" strokeWidth="1.5" />
              <rect x="122" y="180" width="22" height="26" rx="4" fill="#047857" stroke="#064e3b" strokeWidth="1.5" />
              {/* Scout Leaf Badge */}
              <circle cx="70" cy="155" r="7" fill="#fbbf24" />
              <path d="M68 153 Q73 151 72 157 Q67 159 68 153 Z" fill="#065f46" />
            </g>
          )}

          {/* C. SOLAR RANGER JACKET (SDG 7 / 13) */}
          {(outfit === 'solar_jacket' || outfit.includes('Solar') || outfit === 'Solar Ranger Vest') && (
            <g id="outfit_solar_jacket">
              <path
                d="M50 178 Q62 135 88 135 L112 135 Q138 135 150 178 L152 238 L48 238 Z"
                fill="url(#solarJacketGrad)"
                stroke="#c2410c"
                strokeWidth="2"
              />
              {/* Center Zipper line */}
              <line x1="100" y1="135" x2="100" y2="238" stroke="#7c2d12" strokeWidth="3" strokeDasharray="3,1" />
              {/* Collar wings */}
              <polygon points="86,135 100,154 94,135" fill="#fde047" />
              <polygon points="114,135 100,154 106,135" fill="#fde047" />
              {/* Sun crest on chest */}
              <circle cx="75" cy="172" r="9" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
              <circle cx="75" cy="172" r="4.5" fill="#ea580c" />
            </g>
          )}

          {/* D. CLIMATE GUARDIAN COAT */}
          {(outfit === 'climate_coat' || outfit.includes('Climate')) && (
            <g id="outfit_climate_coat">
              <path
                d="M48 178 Q62 133 86 133 L114 133 Q138 133 152 178 L154 238 L46 238 Z"
                fill="url(#climateCoatGrad)"
                stroke="#0f766e"
                strokeWidth="2"
              />
              {/* Coat Lapels */}
              <path d="M84 133 L100 162 L90 133" fill="#042f2e" />
              <path d="M116 133 L100 162 L110 133" fill="#042f2e" />
              {/* Earth Shield Crest */}
              <circle cx="126" cy="170" r="10" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
              <path d="M123 166 Q128 165 129 171 Q125 174 123 166 Z" fill="#22c55e" />
            </g>
          )}

          {/* E. DEFAULT: ECO ADVENTURER T-SHIRT */}
          {(outfit === 'eco_tee' || outfit.includes('Tee') || !['water_hoodie', 'forest_vest', 'solar_jacket', 'climate_coat'].includes(outfit)) && (
            <g id="outfit_eco_tee">
              <path
                d="M52 178 Q62 136 88 136 L112 136 Q138 136 148 178 L150 238 L50 238 Z"
                fill="url(#ecoTeeGrad)"
                stroke="#cbd5e1"
                strokeWidth="2"
              />
              {/* Round neckline */}
              <path d="M88 136 Q100 148 112 136" fill="none" stroke="#10b981" strokeWidth="3.5" />
              {/* Green sleeve trim */}
              <path d="M52 178 Q62 170 68 185" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
              <path d="M148 178 Q138 170 132 185" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
              {/* Earth leaf chest crest */}
              <g transform="translate(100, 185)">
                <circle cx="0" cy="0" r="12" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
                <path d="M-4 -3 Q2 -8 5 0 Q2 6 -4 -3 Z" fill="#10b981" />
                <path d="M-3 2 Q2 4 4 -2" fill="none" stroke="#ffffff" strokeWidth="1" />
              </g>
            </g>
          )}
        </g>

        {/* ---------------- 6. FRONT ACCESSORY STRAPS ---------------- */}
        {(accessory === 'eco_backpack' || accessory === 'Eco Backpack 🎒' || accessory.includes('Backpack')) && (
          <g id="backpack_straps">
            {/* Front shoulder harness straps */}
            <path d="M72 136 L75 220" stroke="#b45309" strokeWidth="7" strokeLinecap="round" />
            <path d="M72 136 L75 220" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
            <path d="M128 136 L125 220" stroke="#b45309" strokeWidth="7" strokeLinecap="round" />
            <path d="M128 136 L125 220" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
            {/* Chest buckle */}
            <rect x="86" y="174" width="28" height="6" rx="2" fill="#78350f" />
            <rect x="96" y="172" width="8" height="10" rx="2" fill="#d97706" />
          </g>
        )}

        {/* ---------------- 7. HAIR STYLES & CAPS ---------------- */}
        <g id="hair_layer" filter="url(#layerShadow)">
          {/* A. SHORT CURLY */}
          {(hairStyle === 'short_curly' || hairStyle.includes('Curly') || hairStyle === 'Short Curly') && (
            <g id="hair_short_curly">
              {/* Back volume */}
              <path
                d="M50 82 Q46 50 75 42 Q100 35 125 42 Q154 50 150 82 Q156 102 144 110 Q146 88 140 76 Q100 65 60 76 Q54 88 56 110 Q44 102 50 82 Z"
                fill={hairColor}
              />
              {/* Front Curls / Bangs */}
              <circle cx="68" cy="54" r="14" fill={hairColor} />
              <circle cx="88" cy="48" r="15" fill={hairColor} />
              <circle cx="112" cy="48" r="15" fill={hairColor} />
              <circle cx="132" cy="54" r="14" fill={hairColor} />
              <circle cx="78" cy="62" r="12" fill={hairColor} />
              <circle cx="122" cy="62" r="12" fill={hairColor} />
              <circle cx="100" cy="58" r="13" fill={hairColor} />
              {/* Hair highlights */}
              <path d="M84 46 Q100 40 116 46" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.3" strokeLinecap="round" />
            </g>
          )}

          {/* B. SPIKY / SPORTY */}
          {(hairStyle === 'spiky' || hairStyle === 'Spiky') && (
            <g id="hair_spiky">
              <path
                d="M52 86 L48 64 L62 60 L60 42 L80 46 L90 28 L104 38 L116 26 L124 44 L142 40 L140 60 L152 66 L148 88 L142 78 Q100 66 58 78 Z"
                fill={hairColor}
              />
              {/* Forehead fringe spikes */}
              <polygon points="68,76 76,86 82,74" fill={hairColor} />
              <polygon points="84,74 94,88 102,74" fill={hairColor} />
              <polygon points="104,74 114,86 122,76" fill={hairColor} />
            </g>
          )}

          {/* C. PONYTAIL / SCOUT */}
          {(hairStyle === 'ponytail' || hairStyle === 'Ponytail') && (
            <g id="hair_ponytail">
              {/* Sleek head wrap */}
              <path
                d="M52 82 Q50 48 80 42 Q100 38 120 42 Q150 48 148 82 Q142 70 120 64 Q100 62 80 64 Q58 70 52 82 Z"
                fill={hairColor}
              />
              {/* High Side/Top Ponytail */}
              <path
                d="M136 50 Q165 35 170 65 Q168 85 152 88 Q158 70 142 56 Z"
                fill={hairColor}
              />
              {/* Ponytail scrunchie band */}
              <ellipse cx="138" cy="52" rx="6" ry="4" fill="#10b981" />
              {/* Soft side bangs */}
              <path d="M60 76 Q72 88 74 102" fill="none" stroke={hairColor} strokeWidth="6" strokeLinecap="round" />
              <path d="M140 76 Q134 88 132 98" fill="none" stroke={hairColor} strokeWidth="5" strokeLinecap="round" />
            </g>
          )}

          {/* D. WAVY LOCKS */}
          {(hairStyle === 'wavy' || hairStyle.includes('Waves') || hairStyle === 'Long Waves') && (
            <g id="hair_wavy">
              {/* Long side tresses */}
              <path d="M54 78 Q42 110 52 140 Q56 120 60 100" fill={hairColor} stroke={hairColor} strokeWidth="4" />
              <path d="M146 78 Q158 110 148 140 Q144 120 140 100" fill={hairColor} stroke={hairColor} strokeWidth="4" />
              {/* Top Crown */}
              <path
                d="M52 82 Q50 45 80 40 Q100 38 120 40 Q148 45 148 82 Q130 65 100 65 Q70 65 52 82 Z"
                fill={hairColor}
              />
              {/* Center parted soft bangs */}
              <path d="M70 68 Q88 74 96 86" fill="none" stroke={hairColor} strokeWidth="6" strokeLinecap="round" />
              <path d="M130 68 Q112 74 104 86" fill="none" stroke={hairColor} strokeWidth="6" strokeLinecap="round" />
            </g>
          )}

          {/* E. EXPLORER CAP / BANGS */}
          {(hairStyle === 'cap_bangs' || accessory === 'explorer_cap' || hairStyle === 'Cool Cap' || accessory.includes('Cap')) && (
            <g id="hair_explorer_cap">
              {/* Visible bangs under cap */}
              <path d="M65 72 Q78 84 86 78" fill="none" stroke={hairColor} strokeWidth="6" strokeLinecap="round" />
              <path d="M114 78 Q122 84 135 72" fill="none" stroke={hairColor} strokeWidth="6" strokeLinecap="round" />
              <path d="M90 74 Q100 82 110 74" fill="none" stroke={hairColor} strokeWidth="5" strokeLinecap="round" />

              {/* Explorer Cap Cap Dome */}
              <path
                d="M48 70 Q50 36 100 36 Q150 36 152 70 Q130 64 100 64 Q70 64 48 70 Z"
                fill="#047857"
                stroke="#064e3b"
                strokeWidth="2"
              />
              {/* Cap Visor / Peak */}
              <path
                d="M44 70 Q100 58 156 70 Q130 84 100 84 Q70 84 44 70 Z"
                fill="#fbbf24"
                stroke="#b45309"
                strokeWidth="2"
              />
              {/* Cap Front Pin/Button */}
              <circle cx="100" cy="50" r="8" fill="#ffffff" stroke="#047857" strokeWidth="1.5" />
              <path d="M100 45 Q96 52 100 55 Q104 52 100 45 Z" fill="#047857" />
            </g>
          )}
        </g>

        {/* ---------------- 8. SDG UNLOCKED HANDHELD & CHEST ITEMS ---------------- */}
        <g id="sdg_items" filter="url(#layerShadow)">
          {/* A. WATER EXPLORER FLASK (SDG 6) */}
          {(sdgItem === 'water_flask' || sdgItem.includes('Water') || sdgItem.includes('Flask') || sdgItem.includes('Bottle')) && (
            <g id="item_water_flask" transform="translate(142, 170)">
              {/* Stainless Bottle with Water Splash */}
              <rect x="0" y="8" width="18" height="38" rx="6" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
              <rect x="3" y="2" width="12" height="7" rx="2" fill="#0369a1" />
              <circle cx="9" cy="27" r="5" fill="#ffffff" fillOpacity="0.8" />
              <path d="M9 24 Q7 28 9 30 Q11 28 9 24 Z" fill="#0284c7" />
              <line x1="4" y1="12" x2="4" y2="40" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" />
            </g>
          )}

          {/* B. NATURE SPROUT PIN / STAFF (SDG 15) */}
          {(sdgItem === 'nature_sprout' || sdgItem.includes('Nature') || sdgItem.includes('Sprout') || sdgItem.includes('Flower')) && (
            <g id="item_nature_sprout" transform="translate(36, 172)">
              {/* Small wooden eco wand/seedling */}
              <path d="M12 0 Q14 20 10 44" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
              <circle cx="12" cy="4" r="8" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />
              {/* Two sprout leaves */}
              <path d="M12 2 Q5 -4 3 4 Q9 8 12 2 Z" fill="#4ade80" />
              <path d="M12 2 Q19 -4 21 4 Q15 8 12 2 Z" fill="#16a34a" />
            </g>
          )}

          {/* C. SOLAR COMPASS (SDG 13 / 7) */}
          {(sdgItem === 'solar_compass' || sdgItem.includes('Solar') || sdgItem.includes('Compass') || sdgItem.includes('Sun')) && (
            <g id="item_solar_compass" transform="translate(138, 176)">
              <circle cx="12" cy="12" r="14" fill="#fef08a" stroke="#ca8a04" strokeWidth="2.5" />
              <circle cx="12" cy="12" r="10" fill="#ffffff" />
              {/* Compass needle */}
              <polygon points="12,5 15,12 12,14" fill="#dc2626" />
              <polygon points="12,19 9,12 12,10" fill="#2563eb" />
              <circle cx="12" cy="12" r="2.5" fill="#78350f" />
            </g>
          )}

          {/* D. RECYCLE BADGE (SDG 12) */}
          {(sdgItem === 'recycle_badge' || sdgItem.includes('Recycle')) && (
            <g id="item_recycle_badge" transform="translate(90, 155)">
              <circle cx="10" cy="10" r="12" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
              {/* 3-arrow mobius recycling loop */}
              <path
                d="M10 3 L12 6 H9 Z M16 11 L14 14 L12 12 Z M5 13 L6 10 L8 12 Z"
                fill="#ffffff"
              />
              <circle cx="10" cy="10" r="4" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3,2" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
