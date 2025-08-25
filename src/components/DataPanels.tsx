import type React from 'react'
import { cn } from '../lib/utils'
import { RiskBadge } from './RiskBadge'
import type { DataPanelsProps } from '../types/gauge'

export const DataPanels = ({
	riskLevel,
	repStaked,
	activeDisputes,
}: DataPanelsProps): React.JSX.Element => {
	const formatNumber = (num: number): string => {
		return num.toLocaleString()
	}

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
		</div>
	)
}
