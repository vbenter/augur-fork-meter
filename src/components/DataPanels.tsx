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
		<div className={cn('flex flex-wrap items-center justify-center gap-8 mb-4')}>
			{isStable ? (
				<div className="text-lg uppercase font-light text-green-400 tracking-[0.1em] flex items-center gap-2">
					<span>✓</span>
					<span>All markets are stable</span>
				</div>
			) : (
				<>
					<div className="flex flex-col items-center">
						<div className="text-sm mb-1 uppercase tracking-[0.1em] font-light text-muted-primary">
							DISPUTE BOND
						</div>
						<div className="text-lg uppercase font-light text-primary tracking-[0.1em]">
							{formatNumber(rawData.metrics.largestDisputeBond)} REP
						</div>
					</div>

					<div className="text-muted-primary/40 text-2xl font-light">|</div>

					<div className="flex flex-col items-center">
						<div className="text-sm mb-1 uppercase tracking-[0.1em] font-light text-muted-primary">
							THRESHOLD
						</div>
						<div className="text-lg uppercase font-light text-primary tracking-[0.1em]">
							{rawData.metrics.forkThresholdPercent.toFixed(1)}% of 275,000
						</div>
					</div>

					<div className="text-muted-primary/40 text-2xl font-light">|</div>

					<div className="flex flex-col items-center">
						<div className="text-sm mb-1 uppercase tracking-[0.1em] font-light text-muted-primary">
							DISPUTE ROUND
						</div>
						<div className="text-lg uppercase font-light text-primary tracking-[0.1em]">
							{largestDispute?.disputeRound || 1}
						</div>
					</div>

				</>
			)}
		</div>
	)
}
