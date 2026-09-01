import React from 'react';

interface AyuvaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBorder?: boolean;
}

export const AyuvaLogo: React.FC<AyuvaLogoProps> = ({
  className = '',
  size = 'md',
  showBorder = true,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return (
    <div
      className={`relative rounded-xl bg-[#030914] flex items-center justify-center overflow-hidden shrink-0 select-none ${
        showBorder ? 'border border-cyan-400/60 shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-500/30' : ''
      } ${sizeClasses[size]} ${className}`}
    >
      {/* 100% Embedded Ayuva Cybernetic Health Emblem — Never 404s */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full p-1"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ayuvaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="shieldBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#083344" />
            <stop offset="100%" stopColor="#021424" />
          </linearGradient>
        </defs>

        {/* Outer Circular Scanner Ring */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="#020817"
          stroke="#06B6D4"
          strokeWidth="2"
          strokeDasharray="6 3"
        />

        {/* Central Geometric Shield */}
        <path
          d="M50 14L82 32V68L50 86L18 68V32L50 14Z"
          fill="url(#shieldBg)"
          stroke="url(#ayuvaGradient)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Inner Facet */}
        <path
          d="M50 24L74 37V63L50 76L26 63V37L50 24Z"
          fill="#0E7490"
          fillOpacity="0.45"
        />

        {/* Bio-Electric ECG Pulse Line */}
        <path
          d="M24 50H36L42 33L50 67L57 43L63 50H76"
          stroke="#38BDF8"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Medical Cross Accent Spark */}
        <circle cx="50" cy="50" r="3.5" fill="#A5F3FC" />
      </svg>
    </div>
  );
};
