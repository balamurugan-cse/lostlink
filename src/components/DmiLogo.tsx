import React from 'react';

interface DmiLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const DmiLogo: React.FC<DmiLogoProps> = ({
  className = '',
  size = 40,
  showText = false
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Official DMI Foundations Logo Emblem: FULLY HUMAN & FULLY ALIVE */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-xs select-none"
        aria-label="DMI Foundations Logo"
      >
        <defs>
          {/* Inner Circular Clip */}
          <clipPath id="dmi-inner-circle">
            <circle cx="60" cy="60" r="42" />
          </clipPath>

          {/* Sky Gradient */}
          <linearGradient id="dmi-sky-grad" x1="60" y1="18" x2="60" y2="82" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="42%" stopColor="#bae6fd" />
            <stop offset="55%" stopColor="#0284c7" />
            <stop offset="68%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#0f3922" />
          </linearGradient>

          {/* Upper Text Arc: DMI FOUNDATIONS */}
          <path
            id="dmi-text-top"
            d="M 10,60 A 50,50 0 0,1 110,60"
            fill="none"
          />

          {/* Lower Text Arc: FULLY HUMAN & FULLY ALIVE */}
          <path
            id="dmi-text-bottom"
            d="M 110,60 A 50,50 0 0,1 10,60"
            fill="none"
          />
        </defs>

        {/* 1. Outer Ring: Dark Purple Border */}
        <circle cx="60" cy="60" r="58" fill="#3b0764" stroke="#2e0854" strokeWidth="2" />

        {/* 2. Top Half Arc: Deep Purple */}
        <path
          d="M 2,60 A 58,58 0 0,1 118,60 L 102,60 A 42,42 0 0,0 18,60 Z"
          fill="#4a154b"
        />

        {/* 3. Bottom Half Arc: Bright Yellow */}
        <path
          d="M 2,60 A 58,58 0 0,0 118,60 L 102,60 A 42,42 0 0,1 18,60 Z"
          fill="#facc15"
        />

        {/* Outer Ring Dividing Separators between Purple & Yellow */}
        <line x1="2" y1="60" x2="18" y2="60" stroke="#3b0764" strokeWidth="1.5" />
        <line x1="102" y1="60" x2="118" y2="60" stroke="#3b0764" strokeWidth="1.5" />

        {/* Outer Ring Border Rings */}
        <circle cx="60" cy="60" r="58" fill="none" stroke="#2e0854" strokeWidth="1.5" />
        <circle cx="60" cy="60" r="42" fill="none" stroke="#2e0854" strokeWidth="1.5" />

        {/* 4. Arched Text: DMI FOUNDATIONS (Bright Yellow on Deep Purple) */}
        <text
          fill="#fde047"
          fontSize="9.5"
          fontWeight="900"
          letterSpacing="1.8"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
        >
          <textPath href="#dmi-text-top" startOffset="50%" textAnchor="middle">
            DMI FOUNDATIONS
          </textPath>
        </text>

        {/* 5. Arched Text: FULLY HUMAN & FULLY ALIVE (Deep Purple on Bright Yellow) */}
        <text
          fill="#4a154b"
          fontSize="7.6"
          fontWeight="900"
          letterSpacing="0.9"
        >
          <textPath href="#dmi-text-bottom" startOffset="50%" textAnchor="middle">
            FULLY HUMAN &amp; FULLY ALIVE
          </textPath>
        </text>

        {/* 6. Inner Artwork clipped to circle */}
        <g clipPath="url(#dmi-inner-circle)">
          {/* Scenic Background (Sky, Sea, Mountains) */}
          <rect x="18" y="18" width="84" height="84" fill="url(#dmi-sky-grad)" />

          {/* Distant Hills / Mountains */}
          <path
            d="M 18,68 Q 38,62 60,65 Q 82,60 102,67 L 102,102 L 18,102 Z"
            fill="#166534"
            opacity="0.85"
          />
          <path
            d="M 18,74 Q 45,70 70,73 Q 90,69 102,75 L 102,102 L 18,102 Z"
            fill="#14532d"
          />

          {/* Soft White Clouds */}
          <ellipse cx="40" cy="34" rx="14" ry="4" fill="#ffffff" opacity="0.35" />
          <ellipse cx="80" cy="36" rx="12" ry="3.5" fill="#ffffff" opacity="0.3" />

          {/* Three Flying White Doves / Birds */}
          {/* Top Left Dove */}
          <g transform="translate(30, 36) scale(0.65)">
            <path
              d="M 0,6 Q 8,0 16,-4 Q 13,4 10,7 Q 16,6 20,4 Q 16,9 9,11 Q 4,11 0,6 Z"
              fill="#ffffff"
            />
            <path d="M 6,5 Q 12,-1 15,-3" stroke="#e2e8f0" strokeWidth="0.8" />
          </g>

          {/* Center-Left Dove */}
          <g transform="translate(48, 29) scale(0.75)">
            <path
              d="M 0,8 Q 7,1 15,-5 Q 12,3 9,7 Q 15,6 19,4 Q 15,9 8,11 Q 4,11 0,8 Z"
              fill="#ffffff"
            />
          </g>

          {/* Top Right Dove */}
          <g transform="translate(74, 23) scale(0.85)">
            <path
              d="M 0,7 Q 9,1 18,-6 Q 14,4 10,8 Q 17,7 21,5 Q 17,11 9,12 Q 4,12 0,7 Z"
              fill="#ffffff"
            />
          </g>

          {/* Foreground Silhouettes (Father/Guide holding hands with two children) */}
          <g fill="#020617">
            {/* Center Adult Figure */}
            {/* Head */}
            <circle cx="60" cy="44" r="4.8" />
            {/* Torso & Shirt */}
            <path d="M 54.5,49.5 L 65.5,49.5 L 67,66 L 53,66 Z" />
            {/* Arms extending out to hold children's hands */}
            <path
              d="M 55,50 L 44,66 L 46,67 L 56,53 Z"
            />
            <path
              d="M 65,50 L 76,66 L 74,67 L 64,53 Z"
            />
            {/* Adult Trousers & Legs */}
            <path d="M 53.5,66 L 58.8,66 L 58.8,88 L 54.5,88 Z" />
            <path d="M 61.2,66 L 66.5,66 L 65.5,88 L 61.2,88 Z" />

            {/* Left Child Figure (Boy) */}
            {/* Head */}
            <circle cx="36" cy="55" r="3.6" />
            {/* Body */}
            <path d="M 32,59 L 40,59 L 41,74 L 31,74 Z" />
            {/* Arm holding adult's hand */}
            <path d="M 39,60 L 45,66 L 43.5,67.5 L 38,62 Z" />
            {/* Left arm by side */}
            <path d="M 32.5,60 L 30,68 L 31.5,68.5 L 34,62 Z" />
            {/* Legs */}
            <path d="M 32,74 L 35.5,74 L 35.5,88 L 32.5,88 Z" />
            <path d="M 36.5,74 L 40,74 L 39.5,88 L 36.5,88 Z" />

            {/* Right Child Figure (Girl with ponytail/dress) */}
            {/* Head & Hair */}
            <circle cx="84" cy="55" r="3.6" />
            <path d="M 87,55 Q 90,57 88,61" stroke="#020617" strokeWidth="1.2" fill="none" />
            {/* Dress / Torso */}
            <path d="M 80,59 L 88,59 L 90.5,75 L 77.5,75 Z" />
            {/* Arm holding adult's hand */}
            <path d="M 81,60 L 75,66 L 76.5,67.5 L 82,62 Z" />
            {/* Right arm by side */}
            <path d="M 87.5,60 L 89.5,68 L 88,68.5 L 86,62 Z" />
            {/* Legs */}
            <path d="M 79.5,75 L 82.5,75 L 82.5,88 L 80,88 Z" />
            <path d="M 84.5,75 L 87.5,75 L 87,88 L 84.5,88 Z" />
          </g>
        </g>
      </svg>

      {/* Optional Side Text */}
      {showText && (
        <div className="flex flex-col text-left leading-none">
          <span className="text-xs font-black tracking-tight text-slate-900 uppercase">
            DMI Foundations
          </span>
          <span className="text-[10px] font-medium text-purple-700 tracking-normal mt-0.5">
            Fully Human &amp; Fully Alive
          </span>
        </div>
      )}
    </div>
  );
};
