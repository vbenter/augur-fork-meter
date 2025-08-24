import React, { useState, useCallback } from 'react'
import { cn } from '../lib/utils'
import { GaugeDisplay } from './GaugeDisplay'
import { DataPanels } from './DataPanels'
import { DebugSidebar } from './DebugSidebar'
import { useForkRisk } from '../contexts/ForkRiskContext'
import type { GaugeData, RiskLevel } from '../types/gauge'

export const ForkMeter = () => {
	const [currentValue, setCurrentValue] = useState<number>(0)
	const [isDebugOpen, setIsDebugOpen] = useState<boolean>(false)
	const [isDemoMode, setIsDemoMode] = useState<boolean>(false)
	const [demoData, setDemoData] = useState<GaugeData>({
		percentage: 0,
		repStaked: 0,
		activeDisputes: 0,
	})
	const [demoLastUpdated, setDemoLastUpdated] = useState<string>('Never')

	// Use the fork risk hook to get real data
	const {
		gaugeData: realData,
		riskLevel: realRiskLevel,
		lastUpdated: realLastUpdated,
		isLoading,
		error,
	} = useForkRisk()

	const generateLowRiskData = useCallback((): GaugeData => {
		const percentage = Math.random() * 25
		const repStaked = Math.floor(Math.random() * 50000) + 10000
		const activeDisputes = Math.floor(Math.random() * 3) + 1

		return { percentage, repStaked, activeDisputes }
	}, [])

	const generateMediumRiskData = useCallback((): GaugeData => {
		const percentage = 30 + Math.random() * 35
		const repStaked = Math.floor(Math.random() * 150000) + 75000
		const activeDisputes = Math.floor(Math.random() * 8) + 3

		return { percentage, repStaked, activeDisputes }
	}, [])

	const generateHighRiskData = useCallback((): GaugeData => {
		const percentage = 70 + Math.random() * 30
		const repStaked = Math.floor(Math.random() * 300000) + 200000
		const activeDisputes = Math.floor(Math.random() * 15) + 8

		return { percentage, repStaked, activeDisputes }
	}, [])

	const updateDataForPercentage = useCallback(
		(percentage: number): GaugeData => {
			// Generate corresponding data based on percentage
			let repStaked: number
			let activeDisputes: number

			if (percentage < 30) {
				repStaked = Math.floor(percentage * 2000) + 10000
				activeDisputes = Math.floor(percentage / 10) + 1
			} else if (percentage < 70) {
				repStaked = Math.floor(percentage * 2500) + 50000
				activeDisputes = Math.floor(percentage / 8) + 2
			} else {
				repStaked = Math.floor(percentage * 3000) + 100000
				activeDisputes = Math.floor(percentage / 5) + 5
			}

			return {
				percentage,
				repStaked,
				activeDisputes,
			}
		},
		[],
	)

	const getRiskLevel = useCallback((percentage: number): RiskLevel => {
		if (percentage < 30) {
			return { level: 'Low' }
		} else if (percentage < 70) {
			return { level: 'Medium' }
		} else {
			return { level: 'High' }
		}
	}, [])

	const enterDemoMode = useCallback(() => {
		setIsDemoMode(true)
	}, [])

	const handleSliderChange = useCallback(
		(percentage: number) => {
			const clampedPercentage = Math.max(0, Math.min(100, percentage))
			setCurrentValue(clampedPercentage)
			const newData = updateDataForPercentage(clampedPercentage)
			setDemoData(newData)
			setDemoLastUpdated(new Date().toLocaleString())
			enterDemoMode()
		},
		[updateDataForPercentage, enterDemoMode],
	)

	const handleLowRiskClick = useCallback(() => {
		const newData = generateLowRiskData()
		setCurrentValue(newData.percentage)
		setDemoData(newData)
		setDemoLastUpdated(new Date().toLocaleString())
		enterDemoMode()
	}, [generateLowRiskData, enterDemoMode])

	const handleMediumRiskClick = useCallback(() => {
		const newData = generateMediumRiskData()
		setCurrentValue(newData.percentage)
		setDemoData(newData)
		setDemoLastUpdated(new Date().toLocaleString())
		enterDemoMode()
	}, [generateMediumRiskData, enterDemoMode])

	const handleHighRiskClick = useCallback(() => {
		const newData = generateHighRiskData()
		setCurrentValue(newData.percentage)
		setDemoData(newData)
		setDemoLastUpdated(new Date().toLocaleString())
		enterDemoMode()
	}, [generateHighRiskData, enterDemoMode])

	const handleToggleDebug = useCallback(() => {
		setIsDebugOpen((prev) => !prev)
	}, [])

	const handleCloseDebug = useCallback(() => {
		setIsDebugOpen(false)
	}, [])

	const handleExitDemoMode = useCallback(() => {
		setIsDemoMode(false)
	}, [])

	// Use demo data if in demo mode, otherwise use real data
	const displayData = isDemoMode ? demoData : realData
	const displayRiskLevel = isDemoMode
		? getRiskLevel(demoData.percentage)
		: realRiskLevel
	const displayLastUpdated = isDemoMode ? demoLastUpdated : realLastUpdated

	return (
		<>
			{/* Fixed Top Bar at Viewport Top */}
			<div className={cn(
				'fixed top-0 left-0 right-0 z-30 transition-all duration-300',
				isDemoMode 
					? 'bg-white/5' 
					: 'bg-transparent'
			)}>
				<div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
					{/* Demo Text - Left Side */}
					{isDemoMode && (
						<div className="text-sm text-green-400">
							Demo Mode
						</div>
					)}
					
					{/* Spacer when not in demo mode */}
					{!isDemoMode && <div />}
					
					{/* Buttons - Right Side */}
					<div className="flex items-center gap-2">
						{/* Settings Button */}
						<button
							onClick={handleToggleDebug}
							className={cn(
								'px-3 py-1.5 text-sm transition-colors',
								isDemoMode 
									? 'hover:bg-white/10 text-green-400 hover:text-green-300'
									: 'border border-primary/20 hover:border-primary/40 text-primary/60 hover:text-primary/80',
								isDebugOpen && (isDemoMode ? 'bg-white/10' : 'bg-primary/10 border-primary/60')
							)}
						>
							{isDemoMode ? 'Settings' : 'Demo'}
						</button>
						
						{/* Reset Button - Only in Demo Mode */}
						{isDemoMode && (
							<button
								onClick={handleExitDemoMode}
								className="px-3 py-1.5 text-sm border border-green-400/50 hover:border-green-400/70 text-green-400 hover:text-green-300 transition-colors"
							>
								Reset
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Main Content with Top Padding */}
			<div className={cn('max-w-4xl w-full text-center pt-20')}>

				<h1 className="text-5xl mb-2 font-light tracking-[0.1em] text-primary">
					AUGUR FORK METER
				</h1>
				<p className="text-lg mb-10 font-light tracking-[0.08em] uppercase text-muted-primary">
					Real-time monitoring of fork probability
				</p>

				{isLoading && !isDemoMode && (
					<div className="mb-4 text-muted-primary">Loading fork risk data...</div>
				)}

				{error && !isDemoMode && (
					<div className="mb-4 text-orange-400">Warning: {error}</div>
				)}

				<GaugeDisplay percentage={displayData.percentage} />

				<DataPanels
					riskLevel={displayRiskLevel}
					repStaked={displayData.repStaked}
					activeDisputes={displayData.activeDisputes}
				/>

				<div className="mt-8 text-sm font-light tracking-[0.05em] uppercase text-muted-primary">
					Last updated: <span className="text-primary">{displayLastUpdated}</span>
				</div>
			</div>

			{/* Debug Sidebar */}
			<DebugSidebar
				isOpen={isDebugOpen}
				onClose={handleCloseDebug}
				currentValue={currentValue}
				onSliderChange={handleSliderChange}
				onLowRiskClick={handleLowRiskClick}
				onMediumRiskClick={handleMediumRiskClick}
				onHighRiskClick={handleHighRiskClick}
				onResetToLiveData={handleExitDemoMode}
				isDemoMode={isDemoMode}
			/>
		</>
	)
}
