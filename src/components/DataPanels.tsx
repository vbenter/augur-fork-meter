import type React from 'react'
import { cn } from '../lib/utils'
<<<<<<< HEAD
import { RiskBadge } from './RiskBadge'
||||||| e90b0aa
import React from 'react';
import { cn } from '../lib/utils';
import { RiskBadge } from './RiskBadge';
import type { DataPanelsProps } from '../types/gauge';
=======
import { useForkRisk } from '../contexts/ForkRiskContext'
>>>>>>> fork-meter-simplified
import type { DataPanelsProps } from '../types/gauge'

export const DataPanels = ({
	riskLevel,
	repStaked,
	activeDisputes,
}: DataPanelsProps): React.JSX.Element => {
<<<<<<< HEAD
||||||| e90b0aa
export const DataPanels: React.FC<DataPanelsProps> = ({ 
  riskLevel, 
  repStaked, 
  activeDisputes 
}) => {
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };
=======
	const { rawData } = useForkRisk()
	
>>>>>>> fork-meter-simplified
	const formatNumber = (num: number): string => {
		return num.toLocaleString()
	}

<<<<<<< HEAD
	return (
		<div
			className={cn('flex flex-wrap items-center justify-center gap-8 mt-8')}
		>
			<div className="flex flex-col items-center">
				<div className="text-sm mb-1 uppercase tracking-[0.1em] font-light text-muted-primary">
					FORK RISK LEVEL
				</div>
				<div className="text-lg uppercase font-light text-white tracking-[0.1em]">
					<RiskBadge level={riskLevel.level} />
				</div>
			</div>

			<div className="text-muted-primary/40 text-2xl font-light">|</div>

			<div className="flex flex-col items-center">
				<div className="text-sm mb-1 uppercase tracking-[0.1em] font-light text-muted-primary">
					REP STAKED IN DISPUTES
				</div>
				<div className="text-lg uppercase font-light text-primary tracking-[0.1em]">
					{formatNumber(repStaked)} REP
				</div>
			</div>

			<div className="text-muted-primary/40 text-2xl font-light">|</div>

			<div className="flex flex-col items-center">
				<div className="text-sm mb-1 uppercase tracking-[0.1em] font-light text-muted-primary">
					ACTIVE DISPUTES
				</div>
				<div className="text-lg uppercase font-light text-primary tracking-[0.1em]">
					{activeDisputes.toString()}
				</div>
			</div>
||||||| e90b0aa
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-8 mt-8")}>
      <div className="flex flex-col items-center">
        <div className="text-sm mb-1 uppercase tracking-[0.1em] font-light text-muted-primary">FORK RISK LEVEL</div>
        <div className="text-lg uppercase font-light text-white tracking-[0.1em]">
          <RiskBadge level={riskLevel.level} />
        </div>
      </div>
      
      <div className="text-muted-primary/40 text-2xl font-light">|</div>
      
      <div className="flex flex-col items-center">
        <div className="text-sm mb-1 uppercase tracking-[0.1em] font-light text-muted-primary">REP STAKED IN DISPUTES</div>
        <div className="text-lg uppercase font-light text-primary tracking-[0.1em]">{formatNumber(repStaked)} REP</div>
      </div>
      
      <div className="text-muted-primary/40 text-2xl font-light">|</div>
      
      <div className="flex flex-col items-center">
        <div className="text-sm mb-1 uppercase tracking-[0.1em] font-light text-muted-primary">ACTIVE DISPUTES</div>
        <div className="text-lg uppercase font-light text-primary tracking-[0.1em]">{activeDisputes.toString()}</div>
      </div>
    </div>
  );
};
=======
	// Check if there are no active disputes (stable state)
	const isStable = rawData.metrics.largestDisputeBond === 0
	
	// Get the largest dispute details if available
	const largestDispute = rawData.metrics.disputeDetails?.length > 0 
		? rawData.metrics.disputeDetails.reduce((largest, current) => 
				current.disputeBondSize > largest.disputeBondSize ? current : largest
			)
		: null

	return (
		<div className="w-full mb-4">
			{isStable ? (
				<div className="text-lg uppercase font-light text-green-400 tracking-[0.1em] flex items-center gap-2 justify-center">
					<span>✓</span>
					<span>System healthy - No market disputes</span>
				</div>
			) : (
				<div className="max-w-2xl mx-auto md:grid md:grid-cols-3 md:gap-x-0 md:gap-y-6 space-y-6 md:space-y-0">
					{/* Panel 1 - Fork Risk */}
					<div className="text-center">
						<div className="text-sm uppercase leading-3 tracking-[0.1em] font-light text-muted-primary">
							FORK RISK
						</div>
						<div className="text-lg uppercase font-light text-primary tracking-[0.1em]">
							{rawData.metrics.forkThresholdPercent.toFixed(1)}%
						</div>
					</div>
					
					{/* Panel 2 - Dispute Bond */}
					<div className="text-center md:border-x md:border-muted-primary/40">
						<div className="text-sm uppercase leading-3 tracking-[0.1em] font-light text-muted-primary">
							DISPUTE BOND
						</div>
						<div className="text-lg uppercase font-light text-primary tracking-[0.1em]">
							{formatNumber(rawData.metrics.largestDisputeBond)} REP
						</div>
					</div>
					
					{/* Panel 3 - Dispute Round */}
					<div className="text-center">
						<div className="text-sm uppercase leading-3 tracking-[0.1em] font-light text-muted-primary">
							DISPUTE ROUND
						</div>
						<div className="text-lg uppercase font-light text-primary tracking-[0.1em]">
							{largestDispute?.disputeRound || 1}
						</div>
					</div>

					{/* Market Address - properly constrained for truncation */}
					{largestDispute && (
						<div className="text-center md:col-span-3">
							<div className="text-sm uppercase leading-3 tracking-[0.1em] font-light text-muted-primary">
								MARKET IN DISPUTE
							</div>
							<div className="uppercase font-light text-primary tracking-[0.1em] truncate mx-auto" style={{ maxWidth: 'calc(100vw - 2rem)' }}>
								{largestDispute.marketId}
							</div>
						</div>
					)}
				</div>
			)}
>>>>>>> fork-meter-simplified
		</div>
	)
}
