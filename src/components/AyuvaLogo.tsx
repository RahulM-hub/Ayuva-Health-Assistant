import React, { useState } from 'react';

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
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-10 h-10 sm:w-11 sm:h-11',
    lg: 'w-12 h-12 sm:w-14 sm:h-14',
    xl: 'w-16 h-16 sm:w-20 sm:h-20',
  };

  return (
    <div
      className={`relative rounded-xl bg-[#020612] flex items-center justify-center overflow-hidden shrink-0 select-none ${
        showBorder ? 'border border-cyan-400/50 shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-500/20' : ''
      } ${sizeClasses[size]} ${className}`}
    >
      {/* 100% Self-Contained Medical Vector Ayuva Emblem (Zero Network Dependency) */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full p-1"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ayuvaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="glowHex" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#083344" />
            <stop offset="100%" stopColor="#041527" />
          </linearGradient>
        </defs>

        {/* Outer Orbit Ring */}
        <circle cx="50" cy="50" r="46" fill="#040A18" stroke="#06B6D4" strokeWidth="2" strokeDasharray="6 3" opacity="0.8" />
        
        {/* Central Shield Hexagon */}
        <path
          d="M50 14L80 31V69L50 86L20 69V31L50 14Z"
          fill="url(#glowHex)"
          stroke="url(#ayuvaGrad)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Inner Accent Facet */}
        <path
          d="M50 24L72 36V64L50 76L28 64V36L50 24Z"
          fill="#0E7490"
          opacity="0.35"
        />

        {/* Medical ECG Pulse Wave */}
        <path
          d="M26 50H38L44 34L52 66L58 44L63 50H74"
          stroke="#38BDF8"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Core Quantum Spark */}
        <circle cx="50" cy="50" r="3" fill="#A5F3FC" />
      </svg>
    </div>
  );
};
