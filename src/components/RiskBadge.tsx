import React from 'react';
import { cn } from '../lib/utils';

interface RiskBadgeProps {
  level: 'Low' | 'Medium' | 'High';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level }) => {
  const getTextColor = (level: string) => {
    switch (level) {
      case 'Low':
        return "text-[color:var(--gauge-color-safe)]";
      case 'Medium':
        return "text-[color:var(--gauge-color-warning)]";
      case 'High':
        return "text-[color:var(--gauge-color-critical)]";
      default:
        return "text-white";
    }
  };

  return (
    <span className={getTextColor(level)}>
      {level}
    </span>
  );
};
