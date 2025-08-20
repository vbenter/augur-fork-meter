import React from 'react';
import { RiskBadge } from './RiskBadge';
import type { DataPanelsProps } from '../types/gauge';

export const DataPanels: React.FC<DataPanelsProps> = ({ 
  riskLevel, 
  repStaked, 
  activeDisputes, 
  totalRep, 
  lastUpdated 
}) => {
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 mt-5">
      <div className="bg-white/10 rounded-xl p-5 backdrop-blur border border-primary/30">
        <div className="text-sm mb-2 uppercase tracking-[0.1em] font-light text-primary">FORK RISK LEVEL</div>
        <div className="text-2xl font-light text-white tracking-[0.05em]">
          <RiskBadge level={riskLevel.level} />
        </div>
      </div>
      
      <div className="bg-white/10 rounded-xl p-5 backdrop-blur border border-primary/30">
        <div className="text-sm mb-2 uppercase tracking-[0.1em] font-light text-primary">REP STAKED IN DISPUTES</div>
        <div className="text-2xl font-light text-white tracking-[0.05em]">{formatNumber(repStaked)} REP</div>
      </div>
      
      <div className="bg-white/10 rounded-xl p-5 backdrop-blur border border-primary/30">
        <div className="text-sm mb-2 uppercase tracking-[0.1em] font-light text-primary">ACTIVE DISPUTES</div>
        <div className="text-2xl font-light text-white tracking-[0.05em]">{activeDisputes.toString()}</div>
      </div>
      
      <div className="bg-white/10 rounded-xl p-5 backdrop-blur border border-primary/30">
        <div className="text-sm mb-2 uppercase tracking-[0.1em] font-light text-primary">TOTAL REP SUPPLY</div>
        <div className="text-2xl font-light text-white tracking-[0.05em]">{formatNumber(totalRep)} REP</div>
      </div>
    </div>
  );
};