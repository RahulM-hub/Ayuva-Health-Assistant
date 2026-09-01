import React, { useState } from 'react';
import ayuvaLogoImg from '../assets/ayuva_logo.jpg';
import { Activity } from 'lucide-react';

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
  // Bundled asset first, falls back to public path, then fallback icon
  const [imgSrc, setImgSrc] = useState<string>(ayuvaLogoImg || '/ayuva_logo.jpg');
  const [imgFailed, setImgFailed] = useState<boolean>(false);

  const handleImageError = () => {
    if (imgSrc !== '/ayuva_logo.jpg') {
      setImgSrc('/ayuva_logo.jpg');
    } else {
      setImgFailed(true);
    }
  };

  const sizeClasses = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-10 h-10 sm:w-11 sm:h-11',
    lg: 'w-12 h-12 sm:w-14 sm:h-14',
    xl: 'w-16 h-16 sm:w-20 sm:h-20',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  };

  return (
    <div
      className={`relative rounded-xl bg-black flex items-center justify-center overflow-hidden shrink-0 select-none ${
        showBorder ? 'border border-cyan-400/50 shadow-lg shadow-cyan-500/25' : ''
      } ${sizeClasses[size]} ${className}`}
    >
      {!imgFailed ? (
        <img
          src={imgSrc}
          alt="Ayuva Health Assistant Logo"
          className="w-full h-full object-contain p-0.5 rounded-lg"
          onError={handleImageError}
          loading="eager"
          decoding="async"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-cyan-950 via-slate-900 to-black flex items-center justify-center text-cyan-400 p-1">
          <Activity className={`${iconSizes[size]} animate-pulse`} />
        </div>
      )}
    </div>
  );
};
