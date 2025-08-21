import React from 'react';
import { cn } from '../lib/utils';
import type { GaugeDisplayProps } from '../types/gauge';

export const GaugeDisplay: React.FC<GaugeDisplayProps> = ({ percentage }) => {
  const updateArc = (percentage: number): string => {
    // Calculate the end point of the arc based on percentage
    // Map percentage to angle from 180° to 0° (π to 0 radians)
    const angle = Math.PI - (percentage / 100) * Math.PI;
    const centerX = 200;
    const centerY = 200;
    const radius = 120;
    
    // Calculate end point
    const endX = centerX + radius * Math.cos(angle);
    const endY = centerY - radius * Math.sin(angle);
    
    // Create arc path with gradient
    if (percentage === 0) {
      return 'M 80 200';
    } else {
      // Always use sweep-flag = 1 for clockwise direction
      return `M 80 200 A 120 120 0 0 1 ${endX} ${endY}`;
    }
  };

  const formatPercentage = (percentage: number): string => {
    return `${percentage % 1 === 0 ? percentage.toFixed(0) : percentage.toFixed(1)}%`;
  };

  return (
    <div className={cn("relative mb-10 flex flex-col gap-y-1 items-center")}>
      <svg className="max-w-[200px] w-full" viewBox="60 60 280 160">
        <defs>
          <linearGradient id="pathGradient" x1="80" y1="200" x2="320" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" style={{ stopColor: 'var(--gauge-color-safe)' }} />
            <stop offset="35%" style={{ stopColor: 'var(--gauge-color-safe-mid)' }} />
            <stop offset="55%" style={{ stopColor: 'var(--gauge-color-warning)' }} />
            <stop offset="80%" style={{ stopColor: 'var(--gauge-color-danger)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--gauge-color-critical)' }} />
          </linearGradient>
          
          <filter id="glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feColorMatrix in="coloredBlur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 3 0"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background track */}
        <path 
          d="M 80 200 A 120 120 0 0 1 320 200" 
          fill="none" 
          stroke="var(--gauge-bg-color)" 
          strokeWidth="var(--gauge-thickness)" 
          strokeLinecap="round"
        />
        
        {/* Dynamic colored arc with CSS glow */}
        <path 
          d={updateArc(percentage)}
          fill="none" 
          stroke="url(#pathGradient)" 
          strokeWidth="var(--gauge-thickness)" 
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 0.5em oklch(from var(--color-primary) l c h / 0.5))' }}
        />
        
        {/* Percentage value at baseline of arc */}
        <text 
          x="200" 
          y="195" 
          textAnchor="middle" 
          fill="var(--color-primary)" 
          fontSize="4.25em" 
          fontWeight="bold"
        >
          {formatPercentage(percentage)}
        </text>
      </svg>
      
      <div className="text-xl uppercase tracking-[0.2em] font-light text-muted-primary">FORK PRESSURE</div>
    </div>
  );
};
