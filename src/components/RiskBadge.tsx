import React from 'react';

interface RiskBadgeProps {
  level: 'Low' | 'Medium' | 'High';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level }) => {
  const getStyles = (level: string) => {
    const baseStyles = "inline-block px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide";
    
    switch (level) {
      case 'Low':
        return `${baseStyles} bg-[color:var(--gauge-color-safe)]/20 text-[color:var(--gauge-color-safe)] border border-[color:var(--gauge-color-safe)]`;
      case 'Medium':
        return `${baseStyles} bg-[color:var(--gauge-color-warning)]/20 text-[color:var(--gauge-color-warning)] border border-[color:var(--gauge-color-warning)]`;
      case 'High':
        return `${baseStyles} bg-[color:var(--gauge-color-critical)]/20 text-[color:var(--gauge-color-critical)] border border-[color:var(--gauge-color-critical)]`;
      default:
        return baseStyles;
    }
  };

  return (
    <span className={getStyles(level)}>
      {level}
    </span>
  );
};