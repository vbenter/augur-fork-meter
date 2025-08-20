import React from 'react';
import { cn } from '../lib/utils';
import { RiskBadge } from './RiskBadge';
import type { DataPanelsProps } from '../types/gauge';

export const DataPanels: React.FC<DataPanelsProps> = ({ 
  riskLevel, 
  repStaked, 
  activeDisputes 
}) => {
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-8 mt-8")}>
      <div className="flex flex-col items-center">
        <div className="text-xs mb-1 uppercase tracking-[0.1em] font-light text-primary/60">FORK RISK LEVEL</div>
        <div className="text-lg font-light text-white tracking-[0.05em]">
          <RiskBadge level={riskLevel.level} />
        </div>
      </div>
      
      <div className="text-primary/40 text-2xl font-light">|</div>
      
      <div className="flex flex-col items-center">
        <div className="text-xs mb-1 uppercase tracking-[0.1em] font-light text-primary/60">REP STAKED IN DISPUTES</div>
        <div className="text-lg font-light text-white tracking-[0.05em]">{formatNumber(repStaked)} REP</div>
      </div>
      
      <div className="text-primary/40 text-2xl font-light">|</div>
      
      <div className="flex flex-col items-center">
        <div className="text-xs mb-1 uppercase tracking-[0.1em] font-light text-primary/60">ACTIVE DISPUTES</div>
        <div className="text-lg font-light text-white tracking-[0.05em]">{activeDisputes.toString()}</div>
      </div>
    </div>
  );
};