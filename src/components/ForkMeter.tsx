import React from 'react'
import { GaugeDisplay } from './GaugeDisplay'
import { DataPanels } from './DataPanels'
import { useForkRisk } from '../contexts/ForkRiskContext'

export const ForkMeter = () => {
	// Use the fork risk hook to get data
	const {
		gaugeData,
		riskLevel,
		lastUpdated,
		isLoading,
		error,
	} = useForkRisk()

	return (
		<div className="max-w-4xl w-full text-center">
			{isLoading && <div className="mb-4 text-muted-primary">Loading fork risk data...</div>}

			{error && <div className="mb-4 text-orange-400">Warning: {error}</div>}

			<GaugeDisplay percentage={gaugeData.percentage} />

			<DataPanels
				riskLevel={riskLevel}
				repStaked={gaugeData.repStaked}
				activeDisputes={gaugeData.activeDisputes}
			/>

			<div className="text-sm font-light tracking-[0.05em] uppercase text-muted-primary">
				Last updated: <span className="text-primary">{lastUpdated}</span>
			</div>
		</div>
	)
}
