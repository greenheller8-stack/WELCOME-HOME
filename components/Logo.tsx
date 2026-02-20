
import React from 'react';

interface LogoProps {
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ size = 32 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_0_8px_rgba(212,255,0,0.5)]"
    >
      {/* The creative vision: A stylized hexagonal "ball" combined with motion streaks representing "flow" */}
      <rect width="100" height="100" rx="20" fill="currentColor" fillOpacity="0.05" />
      
      {/* Outer Glow Shield */}
      <circle cx="50" cy="50" r="45" stroke="#D4FF00" strokeWidth="2" strokeDasharray="10 5" opacity="0.2" />
      
      {/* Core Hexagon Pattern */}
      <path d="M50 20L76 35V65L50 80L24 65V35L50 20Z" stroke="#D4FF00" strokeWidth="6" strokeLinejoin="round" />
      
      {/* Center Dynamic Element */}
      <circle cx="50" cy="50" r="10" fill="#D4FF00" />
      
      {/* Motion Flow Streaks */}
      <path d="M65 35L85 30" stroke="#D4FF00" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <path d="M68 50L88 50" stroke="#D4FF00" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      <path d="M65 65L85 70" stroke="#D4FF00" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
};
