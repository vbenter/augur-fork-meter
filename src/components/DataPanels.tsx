import type React from 'react'
import { cn } from '../lib/utils'
import { useForkRisk } from '../contexts/ForkRiskContext'
import type { DataPanelsProps } from '../types/gauge'

export const DataPanels = ({
	riskLevel,
	repStaked,
	activeDisputes,
}: DataPanelsProps): React.JSX.Element => {
	const { rawData } = useForkRisk()
	
	const formatNumber = (num: number): string => {
		return num.toLocaleString()
	}

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
		</div>
	)
}
