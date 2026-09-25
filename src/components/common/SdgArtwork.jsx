import React from 'react';

/**
 * SDG Quest Vector Visual Assets
 * Replaces keyboard emojis with illustrated vector graphics, badges, and empty states.
 */

// 1. COLLECTIBLE BADGE MEDALLION (Replaces emoji circles in Badges view and victory modals)
export function CollectibleBadge({
  badgeId = 'water_saver',
  unlocked = true,
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  className = ''
}) {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36'
  };

  const badgeStyles = {
    water_saver: {
      rimColor: '#0284c7',
      goldRim: '#38bdf8',
      fill: 'linear-gradient(135deg, #e0f2fe 0%, #38bdf8 100%)',
      glow: 'shadow-cyan-400/40',
      icon: (
        <g transform="translate(50, 48)">
          <path d="M0 -24 Q-18 6 0 20 Q18 6 0 -24 Z" fill="#0284c7" />
          <path d="M-4 -8 Q-12 6 0 14" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="5" cy="5" r="3" fill="#ffffff" fillOpacity="0.8" />
        </g>
      )
    },
    nature_protector: {
      rimColor: '#047857',
      goldRim: '#34d399',
      fill: 'linear-gradient(135deg, #ecfdf5 0%, #10b981 100%)',
      glow: 'shadow-emerald-400/40',
      icon: (
        <g transform="translate(50, 50)">
          <rect x="-4" y="6" width="8" height="18" rx="2" fill="#78350f" />
          <circle cx="0" cy="-6" r="16" fill="#059669" />
          <circle cx="-10" cy="-2" r="12" fill="#10b981" />
          <circle cx="10" cy="-2" r="12" fill="#10b981" />
          <path d="M-6 -6 Q0 -14 6 -6" fill="none" stroke="#a7f3d0" strokeWidth="2" />
        </g>
      )
    },
    waste_warrior: {
      rimColor: '#b45309',
      goldRim: '#fbbf24',
      fill: 'linear-gradient(135deg, #fef3c7 0%, #f59e0b 100%)',
      glow: 'shadow-amber-400/40',
      icon: (
        <g transform="translate(50, 50)">
          <path
            d="M0 -18 L4 -12 H-4 Z M16 8 L11 14 L10 10 Z M-16 8 L-10 10 L-11 14 Z"
            fill="#78350f"
          />
          <path
            d="M0 -14 A14 14 0 0 1 14 6 M11 10 A14 14 0 0 1 -11 10 M-14 6 A14 14 0 0 1 0 -14"
            fill="none"
            stroke="#78350f"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>
      )
    },
    climate_explorer: {
      rimColor: '#0369a1',
      goldRim: '#67e8f9',
      fill: 'linear-gradient(135deg, #e0f2fe 0%, #0284c7 100%)',
      glow: 'shadow-sky-400/40',
      icon: (
        <g transform="translate(50, 50)">
          <circle cx="0" cy="0" r="18" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
          <path d="M-10 -6 Q-2 -12 6 -8 Q10 -2 6 6 Q-4 12 -12 4 Z" fill="#22c55e" />
          <path d="M-4 10 Q2 14 8 10" fill="#22c55e" />
          <circle cx="0" cy="0" r="22" fill="none" stroke="#facc15" strokeWidth="2" strokeDasharray="3,4" />
        </g>
      )
    },
    health_champion: {
      rimColor: '#be123c',
      goldRim: '#fda4af',
      fill: 'linear-gradient(135deg, #fff1f2 0%, #f43f5e 100%)',
      glow: 'shadow-rose-400/40',
      icon: (
        <g transform="translate(50, 50)">
          <path
            d="M0 -6 C-6 -18 -22 -14 -20 2 C-18 14 0 24 0 24 C0 24 18 14 20 2 C22 -14 6 -18 0 -6 Z"
            fill="#e11d48"
          />
          <path
            d="M-8 -6 Q-12 -2 -8 4"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      )
    }
  };

  const currentBadge = badgeStyles[badgeId] || badgeStyles.water_saver;

  if (!unlocked) {
    return (
      <div className={`relative ${sizeMap[size] || sizeMap.md} shrink-0 opacity-45 grayscale ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
          <circle cx="50" cy="50" r="44" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="5" />
          <circle cx="50" cy="50" r="36" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" strokeDasharray="4,3" />
          {/* Lock Icon */}
          <g transform="translate(50, 48)">
            <rect x="-10" y="-4" width="20" height="16" rx="4" fill="#64748b" />
            <path d="M-6 -4 V-10 Q0 -16 6 -10 V-4" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
            <circle cx="0" cy="4" r="2" fill="#ffffff" />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`relative ${sizeMap[size] || sizeMap.md} shrink-0 transition-transform hover:scale-105 ${currentBadge.glow} ${className}`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
        <defs>
          <linearGradient id={`grad_${badgeId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Outer Ribbon Tips (Decorative) */}
        <path d="M22 75 L14 96 L32 88 Z" fill="#b45309" />
        <path d="M78 75 L86 96 L68 88 Z" fill="#b45309" />

        {/* Outer Gold Scalloped Ring */}
        <circle cx="50" cy="50" r="46" fill="#fef08a" stroke="#ca8a04" strokeWidth="3" />
        <circle cx="50" cy="50" r="41" fill={currentBadge.rimColor} />
        <circle cx="50" cy="50" r="36" fill={currentBadge.goldRim} stroke="#ffffff" strokeWidth="2" />

        {/* Main Inner Disc */}
        <circle cx="50" cy="50" r="32" fill="#ffffff" />

        {/* Badge Artwork Icon */}
        {currentBadge.icon}

        {/* Gloss Sheen */}
        <path
          d="M24 38 A32 32 0 0 1 76 38 Q50 48 24 38 Z"
          fill="#ffffff"
          fillOpacity="0.35"
        />

        {/* Stars on Rim */}
        <circle cx="50" cy="12" r="2.5" fill="#fef08a" />
        <circle cx="84" cy="42" r="2.5" fill="#fef08a" />
        <circle cx="16" cy="42" r="2.5" fill="#fef08a" />
      </svg>
    </div>
  );
}

// 2. THEMATIC SDG EMBLEM GRAPHIC (Replaces raw emojis on SDG cards and hubs)
export function SdgEmblem({ sdgNumber = 6, size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28'
  };

  switch (sdgNumber) {
    case 3: // Good Health
      return (
        <div className={`${sizeMap[size] || sizeMap.md} shrink-0 ${className}`}>
          <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow">
            <rect width="80" height="80" rx="20" fill="#4c9f38" />
            <path
              d="M40 22 C34 10 18 14 20 30 C22 42 40 54 40 54 C40 54 58 42 60 30 C62 14 46 10 40 22 Z"
              fill="#ffffff"
            />
            {/* Heartbeat EKG Pulse inside */}
            <path
              d="M24 32 H32 L36 24 L42 42 L46 28 L50 32 H56"
              fill="none"
              stroke="#4c9f38"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 6: // Clean Water
      return (
        <div className={`${sizeMap[size] || sizeMap.md} shrink-0 ${className}`}>
          <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow">
            <rect width="80" height="80" rx="20" fill="#26bde2" />
            {/* Water Drop with Ripples */}
            <circle cx="40" cy="56" r="16" fill="#ffffff" fillOpacity="0.25" />
            <path
              d="M40 18 C32 32 25 44 25 52 C25 61 31.7 66 40 66 C48.3 66 55 61 55 52 C55 44 48 32 40 18 Z"
              fill="#ffffff"
            />
            {/* Water wave line inside drop */}
            <path
              d="M30 52 Q35 48 40 52 T50 52"
              fill="none"
              stroke="#26bde2"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );

    case 12: // Responsible Consumption
      return (
        <div className={`${sizeMap[size] || sizeMap.md} shrink-0 ${className}`}>
          <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow">
            <rect width="80" height="80" rx="20" fill="#bf8b2e" />
            {/* Infinite Recycle Infinity Loop */}
            <path
              d="M28 40 C28 32 38 32 40 40 C42 48 52 48 52 40 C52 32 42 32 40 40 C38 48 28 48 28 40 Z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <polygon points="56,36 50,42 50,30" fill="#ffffff" />
            <polygon points="24,44 30,38 30,50" fill="#ffffff" />
          </svg>
        </div>
      );

    case 13: // Climate Action
      return (
        <div className={`${sizeMap[size] || sizeMap.md} shrink-0 ${className}`}>
          <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow">
            <rect width="80" height="80" rx="20" fill="#3f7e44" />
            {/* Earth with Sun Rays */}
            <circle cx="40" cy="42" r="20" fill="#ffffff" />
            <circle cx="40" cy="42" r="17" fill="#0284c7" />
            {/* Continents */}
            <path d="M30 36 Q38 30 46 34 Q50 40 45 48 Q35 52 28 44 Z" fill="#22c55e" />
            {/* Sun peek */}
            <circle cx="56" cy="22" r="9" fill="#facc15" stroke="#ffffff" strokeWidth="2" />
          </svg>
        </div>
      );

    case 15: // Life on Land
      return (
        <div className={`${sizeMap[size] || sizeMap.md} shrink-0 ${className}`}>
          <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow">
            <rect width="80" height="80" rx="20" fill="#56c02b" />
            {/* Lush Tree and Sprout */}
            <circle cx="40" cy="34" r="18" fill="#ffffff" />
            <rect x="36" y="46" width="8" height="16" rx="2" fill="#78350f" />
            <circle cx="32" cy="34" r="14" fill="#15803d" />
            <circle cx="48" cy="34" r="14" fill="#15803d" />
            <circle cx="40" cy="24" r="13" fill="#22c55e" />
          </svg>
        </div>
      );

    default:
      return (
        <div className={`${sizeMap[size] || sizeMap.md} shrink-0 ${className}`}>
          <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow">
            <rect width="80" height="80" rx="20" fill="#0284c7" />
            <circle cx="40" cy="40" r="22" fill="#ffffff" fillOpacity="0.2" />
            <text x="40" y="49" fill="#ffffff" fontSize="26" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
              {sdgNumber}
            </text>
          </svg>
        </div>
      );
  }
}

// 3. ILLUSTRATED MISSION ARTWORK BANNERS (Replaces raw emoji icons in mission cards)
export function MissionIllustration({ missionId = 'm_water_1', className = '' }) {
  if (missionId.includes('water')) {
    return (
      <div className={`w-full aspect-[2/1] rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 overflow-hidden relative ${className}`}>
        <svg viewBox="0 0 400 200" className="w-full h-full">
          {/* Waves */}
          <path d="M0 160 Q100 130 200 160 T400 160 L400 200 L0 200 Z" fill="#0284c7" fillOpacity="0.4" />
          <path d="M0 175 Q100 155 200 175 T400 175 L400 200 L0 200 Z" fill="#0369a1" fillOpacity="0.6" />
          {/* Bathroom Sink / Tap illustration */}
          <g transform="translate(180, 50)">
            {/* Water Tap Faucet */}
            <path d="M10 50 V20 Q10 0 35 0 H45 V15" fill="none" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" />
            <rect x="36" y="15" width="18" height="8" rx="2" fill="#94a3b8" />
            {/* Tap handle */}
            <rect x="0" y="0" width="22" height="7" rx="3" fill="#38bdf8" />
            {/* Sparkling Clean Droplet */}
            <path d="M45 32 Q38 48 45 56 Q52 48 45 32 Z" fill="#67e8f9" />
            <circle cx="43" cy="50" r="2" fill="#ffffff" />
          </g>
          {/* Toothbrush & Clean bubbles */}
          <g transform="translate(250, 110)">
            <rect x="0" y="8" width="60" height="8" rx="4" fill="#34d399" transform="rotate(-25)" />
            <circle cx="10" cy="-2" r="5" fill="#ffffff" fillOpacity="0.8" />
            <circle cx="25" cy="-8" r="7" fill="#ffffff" fillOpacity="0.8" />
          </g>
        </svg>
      </div>
    );
  }

  if (missionId.includes('land')) {
    return (
      <div className={`w-full aspect-[2/1] rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 overflow-hidden relative ${className}`}>
        <svg viewBox="0 0 400 200" className="w-full h-full">
          {/* Rolling Hills */}
          <ellipse cx="120" cy="220" rx="220" ry="100" fill="#047857" fillOpacity="0.5" />
          <ellipse cx="300" cy="230" rx="200" ry="90" fill="#065f46" fillOpacity="0.7" />
          {/* Plant in Pot */}
          <g transform="translate(180, 70)">
            {/* Clay pot */}
            <polygon points="10,50 38,50 34,80 14,80" fill="#ea580c" />
            <rect x="6" y="44" width="36" height="8" rx="2" fill="#c2410c" />
            {/* Sprout & Leaf */}
            <path d="M24 45 V15" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
            <path d="M24 25 Q12 18 10 28 Q18 34 24 25 Z" fill="#4ade80" />
            <path d="M24 18 Q36 10 38 20 Q30 26 24 18 Z" fill="#22c55e" />
          </g>
          {/* Warm Sun */}
          <circle cx="340" cy="45" r="26" fill="#facc15" fillOpacity="0.9" />
        </svg>
      </div>
    );
  }

  if (missionId.includes('consumption')) {
    return (
      <div className={`w-full aspect-[2/1] rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-500 overflow-hidden relative ${className}`}>
        <svg viewBox="0 0 400 200" className="w-full h-full">
          <rect y="160" width="400" height="40" fill="#78350f" fillOpacity="0.2" />
          {/* Blue Recycling Bin & Cardboard Box */}
          <g transform="translate(150, 70)">
            {/* Bin */}
            <polygon points="10,20 60,20 54,80 16,80" fill="#0284c7" />
            <rect x="6" y="14" width="58" height="8" rx="2" fill="#0369a1" />
            {/* Recycle logo on bin */}
            <circle cx="35" cy="50" r="10" fill="#ffffff" fillOpacity="0.25" />
            <polygon points="35,44 38,48 32,48" fill="#ffffff" />
            {/* Cardboard box next to it */}
            <rect x="75" y="40" width="42" height="40" rx="4" fill="#d97706" />
            <rect x="75" y="40" width="42" height="10" fill="#b45309" />
          </g>
        </svg>
      </div>
    );
  }

  if (missionId.includes('climate')) {
    return (
      <div className={`w-full aspect-[2/1] rounded-2xl bg-gradient-to-tr from-indigo-700 to-cyan-600 overflow-hidden relative ${className}`}>
        <svg viewBox="0 0 400 200" className="w-full h-full">
          {/* Night sky with warm lamp & moon */}
          <circle cx="80" cy="45" r="22" fill="#fef08a" />
          <circle cx="88" cy="41" r="20" fill="#4338ca" />
          {/* Switch turned off / Eco Light Bulb */}
          <g transform="translate(180, 50)">
            <ellipse cx="25" cy="30" rx="20" ry="24" fill="#fef08a" fillOpacity="0.8" />
            <rect x="18" y="52" width="14" height="10" fill="#94a3b8" />
            <path d="M18 62 Q25 66 32 62" stroke="#64748b" strokeWidth="2" fill="none" />
            {/* Off toggle */}
            <rect x="65" y="24" width="24" height="44" rx="12" fill="#1e293b" />
            <circle cx="77" cy="54" r="8" fill="#22c55e" />
          </g>
        </svg>
      </div>
    );
  }

  // SDG 3 Health Challenge
  return (
    <div className={`w-full aspect-[2/1] rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 overflow-hidden relative ${className}`}>
      <svg viewBox="0 0 400 200" className="w-full h-full">
        {/* Rainbow Plate with Fresh Fruit */}
        <g transform="translate(160, 40)">
          {/* Plate */}
          <circle cx="45" cy="55" r="48" fill="#ffffff" stroke="#fecdd3" strokeWidth="4" />
          <circle cx="45" cy="55" r="38" fill="#fff1f2" />
          {/* Apple, carrot, broccoli */}
          <circle cx="34" cy="45" r="14" fill="#e11d48" />
          <circle cx="56" cy="45" r="12" fill="#f97316" />
          <circle cx="45" cy="68" r="15" fill="#16a34a" />
        </g>
      </svg>
    </div>
  );
}

// 4. EMPTY STATE ILLUSTRATIONS (Replaces emoji empty states)
export function EmptyBookIllustration({ className = '' }) {
  return (
    <div className={`w-44 h-36 mx-auto ${className}`}>
      <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow">
        {/* Open Scrapbook Spine & Covers */}
        <path d="M20 120 L96 130 L96 35 L20 25 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2.5" />
        <path d="M180 120 L104 130 L104 35 L180 25 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2.5" />
        {/* Left Parchment Page */}
        <path d="M26 114 L94 122 L94 40 L26 32 Z" fill="#fffbeb" stroke="#fde68a" strokeWidth="1.5" />
        {/* Right Parchment Page */}
        <path d="M174 114 L106 122 L106 40 L174 32 Z" fill="#fffbeb" stroke="#fde68a" strokeWidth="1.5" />
        {/* Photo corner placeholders */}
        <rect x="36" y="46" width="46" height="42" rx="4" fill="#fef3c7" stroke="#cbd5e1" strokeDasharray="3,2" />
        <rect x="118" y="46" width="46" height="42" rx="4" fill="#fef3c7" stroke="#cbd5e1" strokeDasharray="3,2" />
        {/* Sparkles floating out */}
        <circle cx="100" cy="20" r="4" fill="#f59e0b" className="animate-ping" />
        <path d="M60 16 L62 22 L68 24 L62 26 L60 32 L58 26 L52 24 L58 22 Z" fill="#f59e0b" />
        <path d="M140 18 L142 22 L146 23 L142 25 L140 29 L138 25 L134 23 L138 22 Z" fill="#10b981" />
      </svg>
    </div>
  );
}

export function EmptyBadgesIllustration({ className = '' }) {
  return (
    <div className={`w-44 h-36 mx-auto ${className}`}>
      <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow">
        {/* Wooden Trophy Shelf */}
        <rect x="20" y="110" width="160" height="14" rx="4" fill="#b45309" stroke="#78350f" strokeWidth="2" />
        <polygon points="35,124 45,145 55,124" fill="#92400e" />
        <polygon points="145,124 155,145 165,124" fill="#92400e" />
        {/* Pedestals with dashed badge outlines */}
        <circle cx="60" cy="65" r="26" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="6,4" />
        <circle cx="140" cy="65" r="26" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="6,4" />
        {/* Star in center */}
        <polygon points="100,45 106,62 124,62 109,73 115,90 100,79 85,90 91,73 76,62 94,62" fill="#fef08a" stroke="#eab308" strokeWidth="2" />
      </svg>
    </div>
  );
}
