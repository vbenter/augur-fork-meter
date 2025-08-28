import type React from 'react'
import { useState } from 'react'
import { cn } from '../lib/utils'
import { useForkRisk } from '../contexts/ForkRiskContext'
import { useDemo } from '../contexts/DemoContext'
<<<<<<< HEAD

interface DemoSidebarProps {
	isOpen: boolean
	onClose: () => void
}

export const DemoSidebar = ({
	isOpen,
	onClose,
}: DemoSidebarProps): React.JSX.Element => {
	const [currentValue, setCurrentValue] = useState<number>(0)
	
	// Get current data and demo controls from contexts
	const { rawData, lastUpdated, isLoading, error } = useForkRisk()
	const { isDemo, generateRisk, resetToLive } = useDemo()

	// Handle slider changes
	const handleSliderChange = (value: number) => {
		setCurrentValue(value)
		generateRisk(value)
	}

	// Handle preset buttons
	const handleLowRisk = () => {
		const value = 5
		setCurrentValue(value)
		generateRisk(value)
	}

	const handleMediumRisk = () => {
		const value = 35
		setCurrentValue(value)
		generateRisk(value)
	}

	const handleHighRisk = () => {
		const value = 75
		setCurrentValue(value)
		generateRisk(value)
	}

	const formatCurrency = (amount: number): string => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount)
	}

	const formatNumber = (num: number): string => {
		return new Intl.NumberFormat('en-US').format(num)
	}

	return (
		<>
			{/* Backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40"
					onClick={onClose}
					aria-hidden="true"
				/>
			)}

			{/* Sidebar */}
			<div
				className={cn(
					'fixed top-0 right-0 h-full bg-stone-900 border-l border-stone-800 z-50 transform transition-transform duration-300 ease-in-out',
					'w-full sm:w-96 lg:w-[28rem]',
					isOpen ? 'translate-x-0' : 'translate-x-full'
				)}
			>
				<div className="flex flex-col h-full">
					{/* Header */}
					<div className="flex items-center justify-between p-4 border-b border-stone-800">
						<h2 className="text-lg font-semibold text-primary">Debug Panel</h2>
						<button
							onClick={onClose}
							className="p-1 hover:bg-stone-800 transition-colors"
							aria-label="Close debug panel"
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					{/* Content */}
					<div className="flex-1 overflow-y-auto p-4 space-y-6">
						{/* Demo Override Values Section - Only when in demo mode */}
						{isDemo && (
							<section>
								<h3 className="text-sm font-medium text-green-400 mb-3 uppercase tracking-wide">
									Current Values (Demo Active)
								</h3>
								<div className="bg-green-900/20 border border-green-700/50 p-3 rounded space-y-1">
									<div className="flex justify-between">
										<span className="text-muted-primary">Risk Level:</span>
										<span className="text-green-300 capitalize">{rawData.riskLevel}</span>
									</div>
									
									<div className="flex justify-between">
										<span className="text-muted-primary">Risk Percentage:</span>
										<span className="text-green-300">{rawData.riskPercentage}%</span>
									</div>
									
									<div className="flex justify-between">
										<span className="text-muted-primary">Active Disputes:</span>
										<span className="text-green-300">{rawData.metrics.activeDisputes}</span>
									</div>
									
									<div className="flex justify-between">
										<span className="text-muted-primary">Largest Bond:</span>
										<span className="text-green-300">{formatNumber(rawData.metrics.largestDisputeBond)} REP</span>
									</div>
									
									<div className="flex justify-between">
										<span className="text-muted-primary">REP Market Cap:</span>
										<span className="text-green-300">{formatCurrency(rawData.metrics.repMarketCap)}</span>
									</div>
									
									<div className="flex justify-between">
										<span className="text-muted-primary">Open Interest:</span>
										<span className="text-green-300">{formatCurrency(rawData.metrics.openInterest)}</span>
									</div>
									
									<div className="flex justify-between">
										<span className="text-muted-primary">Security Ratio:</span>
										<span className="text-green-300">{rawData.metrics.securityRatio.toFixed(2)}x</span>
									</div>

									<div className="flex justify-between">
										<span className="text-muted-primary">Method:</span>
										<span className="text-green-300">{rawData.calculation.method}</span>
									</div>
								</div>
							</section>
						)}

						{/* Live Data Section */}
						{!isDemo && (
							<section>
								<h3 className="text-sm font-medium text-primary mb-3 uppercase tracking-wide">
									Current Values (Live Data)
								</h3>
							
							{isLoading && (
								<div className="text-sm text-muted-primary">Loading...</div>
							)}
							
							{error && (
								<div className="text-sm text-orange-400 mb-2">Error: {error}</div>
							)}

							{rawData && (
								<div className="space-y-1">
									<div className="flex justify-between">
										<span className="text-muted-primary">Risk Level:</span>
										<span className="text-primary capitalize">{rawData.riskLevel}</span>
									</div>
									
									<div className="flex justify-between">
										<span className="text-muted-primary">Risk Percentage:</span>
										<span className="text-primary">{rawData.riskPercentage}%</span>
									</div>
									
									<div className="flex justify-between">
										<span className="text-muted-primary">Active Disputes:</span>
										<span className="text-primary">{rawData.metrics.activeDisputes}</span>
									</div>
									
									<div className="flex justify-between">
										<span className="text-muted-primary">Largest Bond:</span>
										<span className="text-primary">{formatNumber(rawData.metrics.largestDisputeBond)} REP</span>
									</div>
									
									<div className="flex justify-between">
										<span className="text-muted-primary">REP Market Cap:</span>
										<span className="text-primary">{formatCurrency(rawData.metrics.repMarketCap)}</span>
									</div>
									
									<div className="flex justify-between">
										<span className="text-muted-primary">Open Interest:</span>
										<span className="text-primary">{formatCurrency(rawData.metrics.openInterest)}</span>
									</div>
									
									<div className="flex justify-between">
										<span className="text-muted-primary">Security Ratio:</span>
										<span className="text-primary">{rawData.metrics.securityRatio.toFixed(2)}x</span>
									</div>

									{rawData.rpcInfo && (
										<>
											<div className="flex justify-between">
												<span className="text-muted-primary">RPC Endpoint:</span>
												<span className="text-primary truncate max-w-32">
													{rawData.rpcInfo.endpoint?.replace('https://', '')}
												</span>
											</div>
											
											{rawData.rpcInfo.latency && (
												<div className="flex justify-between">
													<span className="text-muted-primary">Latency:</span>
													<span className="text-primary">{rawData.rpcInfo.latency}ms</span>
												</div>
											)}
										</>
									)}
									
									<div className="flex justify-between">
										<span className="text-muted-primary">Block Number:</span>
										<span className="text-primary">{formatNumber(rawData.blockNumber || 0)}</span>
									</div>
									
									<div className="flex justify-between">
										<span className="text-muted-primary">Last Updated:</span>
										<span className="text-primary">{lastUpdated}</span>
									</div>
								</div>
							)}
						</section>
					)}

						{/* Demo Controls Section */}
						<section>
							<h3 className="text-sm font-medium text-primary mb-3 uppercase tracking-wide">
								Demo Controls
							</h3>
							
							{isDemo && (
								<button
									onClick={resetToLive}
									className="w-full mb-4 px-3 py-2 bg-stone-800 hover:bg-stone-700 border border-stone-600 transition-colors text-sm"
								>
									Reset to Live Data
								</button>
							)}

							<div className="space-y-4">
								{/* Manual Slider */}
								<div>
									<label className="block text-xs text-muted-primary mb-2 uppercase tracking-wide">
										Manual Percentage
									</label>
									<div className="flex items-center gap-3">
										<input
											type="range"
											min="0"
											max="100"
											step="1"
											value={currentValue}
											onChange={(e) => handleSliderChange(Number(e.target.value))}
											className="flex-1 h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer slider"
										/>
										<span className="text-sm text-primary w-12 text-right">
											{currentValue}%
										</span>
									</div>
								</div>

								{/* Preset Buttons */}
								<div>
									<label className="block text-xs text-muted-primary mb-2 uppercase tracking-wide">
										Risk Presets
									</label>
									<div className="grid grid-cols-3 gap-2">
										<button
											onClick={handleLowRisk}
											className="px-3 py-2 bg-green-900/30 hover:bg-green-800/40 border border-green-700 transition-colors text-xs"
										>
											Low Risk
										</button>
										<button
											onClick={handleMediumRisk}
											className="px-3 py-2 bg-yellow-900/30 hover:bg-yellow-800/40 border border-yellow-700 transition-colors text-xs"
										>
											Medium Risk
										</button>
										<button
											onClick={handleHighRisk}
											className="px-3 py-2 bg-red-900/30 hover:bg-red-800/40 border border-red-700 transition-colors text-xs"
										>
											High Risk
||||||| e90b0aa
=======
import { 
	generateNoDisputesDemo,
	generateLowRiskDemo,
	generateModerateRiskDemo,
	generateHighRiskDemo,
	generateCriticalRiskDemo 
} from '../utils/demoDataGenerator'

interface DemoSidebarProps {
	isOpen: boolean
	onClose: () => void
}

export const DemoSidebar = ({
	isOpen,
	onClose,
}: DemoSidebarProps): React.JSX.Element => {
	const [currentScenario, setCurrentScenario] = useState<string>('none')
	
	// Get current data and demo controls from contexts
	const { rawData, lastUpdated, isLoading, error } = useForkRisk()
	const { isDemo, setDemoData, resetToLive } = useDemo()

	// Handle risk level scenario buttons
	const handleNoDisputes = () => {
		setCurrentScenario('no_disputes')
		const demoData = generateNoDisputesDemo()
		setDemoData(demoData)
	}

	const handleLowRisk = () => {
		setCurrentScenario('low_risk')
		const demoData = generateLowRiskDemo()
		setDemoData(demoData)
	}

	const handleModerateRisk = () => {
		setCurrentScenario('moderate_risk')
		const demoData = generateModerateRiskDemo()
		setDemoData(demoData)
	}

	const handleHighRisk = () => {
		setCurrentScenario('high_risk')
		const demoData = generateHighRiskDemo()
		setDemoData(demoData)
	}

	const handleCriticalRisk = () => {
		setCurrentScenario('critical_risk')
		const demoData = generateCriticalRiskDemo()
		setDemoData(demoData)
	}

	const formatCurrency = (amount: number): string => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount)
	}

	const formatNumber = (num: number): string => {
		return new Intl.NumberFormat('en-US').format(num)
	}

	return (
		<>
			{/* Backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40"
					onClick={onClose}
					aria-hidden="true"
				/>
			)}

			{/* Sidebar */}
			<div
				className={cn(
					'fixed top-0 right-0 h-full bg-stone-900 border-l border-stone-800 z-50 transform transition-transform duration-300 ease-in-out',
					'w-full sm:w-96 lg:w-[28rem]',
					isOpen ? 'translate-x-0' : 'translate-x-full'
				)}
			>
				<div className="flex flex-col h-full">
					{/* Header */}
					<div className="flex items-center justify-between p-4 border-b border-stone-800">
						<h2 className="text-lg font-semibold text-primary">Debug Panel</h2>
						<button
							onClick={onClose}
							className="p-1 hover:bg-stone-800 transition-colors"
							aria-label="Close debug panel"
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					{/* Content */}
					<div className="flex-1 overflow-y-auto p-4 space-y-6">
						{/* Demo Override Values Section - Only when in demo mode */}
						{isDemo && (
							<section>
								<h3 className="text-sm font-medium text-green-400 mb-3 uppercase tracking-wide">
									Current Values (Demo Active)
								</h3>
								<div className="bg-green-900/20 border border-green-700/50 p-3 rounded space-y-1">
									<div className="flex justify-between">
										<span className="text-muted-primary">Risk Level:</span>
										<span className="text-green-300 capitalize">{rawData.riskLevel}</span>
									</div>
									
									<div className="flex justify-between">
										<span className="text-muted-primary">Risk Percentage:</span>
										<span className="text-green-300">{rawData.riskPercentage}%</span>
									</div>
									
									<div className="flex justify-between">
										<span className="text-muted-primary">Active Disputes:</span>
										<span className="text-green-300">{rawData.metrics.activeDisputes}</span>
									</div>
									
									<div className="flex justify-between">
										<span className="text-muted-primary">Largest Bond:</span>
										<span className="text-green-300">{formatNumber(rawData.metrics.largestDisputeBond)} REP</span>
									</div>
									
									<div className="flex justify-between">
										<span className="text-muted-primary">Fork Threshold %:</span>
										<span className="text-green-300">{rawData.metrics.forkThresholdPercent}%</span>
									</div>

									<div className="flex justify-between">
										<span className="text-muted-primary">Method:</span>
										<span className="text-green-300">{rawData.calculation.method}</span>
									</div>
								</div>
							</section>
						)}

						{/* Live Data Section */}
						{!isDemo && (
							<section>
								<h3 className="text-sm font-medium text-primary mb-3 uppercase tracking-wide">
									Current Values (Live Data)
								</h3>
							
							{isLoading && (
								<div className="text-sm text-muted-primary">Loading...</div>
							)}
							
							{error && (
								<div className="text-sm text-orange-400 mb-2">Error: {error}</div>
							)}

							{rawData && (
								<div className="space-y-1">
									<div className="flex justify-between">
										<span className="text-muted-primary">Risk Level:</span>
										<span className="text-primary capitalize">{rawData.riskLevel}</span>
									</div>
									
									<div className="flex justify-between">
										<span className="text-muted-primary">Risk Percentage:</span>
										<span className="text-primary">{rawData.riskPercentage}%</span>
									</div>
									
									<div className="flex justify-between">
										<span className="text-muted-primary">Active Disputes:</span>
										<span className="text-primary">{rawData.metrics.activeDisputes}</span>
									</div>
									
									<div className="flex justify-between">
										<span className="text-muted-primary">Largest Bond:</span>
										<span className="text-primary">{formatNumber(rawData.metrics.largestDisputeBond)} REP</span>
									</div>
									
									<div className="flex justify-between">
										<span className="text-muted-primary">Fork Threshold %:</span>
										<span className="text-primary">{rawData.metrics.forkThresholdPercent}%</span>
									</div>

									{rawData.rpcInfo && (
										<>
											<div className="flex justify-between">
												<span className="text-muted-primary">RPC Endpoint:</span>
												<span className="text-primary truncate max-w-32">
													{rawData.rpcInfo.endpoint?.replace('https://', '')}
												</span>
											</div>
											
											{rawData.rpcInfo.latency && (
												<div className="flex justify-between">
													<span className="text-muted-primary">Latency:</span>
													<span className="text-primary">{rawData.rpcInfo.latency}ms</span>
												</div>
											)}
										</>
									)}
									
									<div className="flex justify-between">
										<span className="text-muted-primary">Block Number:</span>
										<span className="text-primary">{formatNumber(rawData.blockNumber || 0)}</span>
									</div>
									
									<div className="flex justify-between">
										<span className="text-muted-primary">Last Updated:</span>
										<span className="text-primary">{lastUpdated}</span>
									</div>
								</div>
							)}
						</section>
					)}

						{/* Demo Controls Section */}
						<section>
							<h3 className="text-sm font-medium text-primary mb-3 uppercase tracking-wide">
								Demo Controls
							</h3>
							
							{isDemo && (
								<button
									onClick={resetToLive}
									className="w-full mb-4 px-3 py-2 bg-stone-800 hover:bg-stone-700 border border-stone-600 transition-colors text-sm"
								>
									Reset to Live Data
								</button>
							)}

							<div className="space-y-4">
								{/* Risk Level Scenarios */}
								<div>
									<label className="block text-xs text-muted-primary mb-2 uppercase tracking-wide">
										Risk Level Scenarios
									</label>
									<div className="grid grid-cols-1 gap-2">
										<button
											onClick={handleNoDisputes}
											className={cn(
												"px-3 py-2 text-xs transition-colors text-left",
												currentScenario === 'no_disputes'
													? "bg-green-900/50 border border-green-600 text-green-300"
													: "bg-green-900/20 hover:bg-green-800/30 border border-green-800 text-green-400"
											)}
										>
											No Risk (0 REP disputes)
										</button>
										<button
											onClick={handleLowRisk}
											className={cn(
												"px-3 py-2 text-xs transition-colors text-left",
												currentScenario === 'low_risk'
													? "bg-green-900/50 border border-green-600 text-green-300"
													: "bg-green-900/20 hover:bg-green-800/30 border border-green-800 text-green-400"
											)}
										>
											Low Risk (0.4-10% threshold)
										</button>
										<button
											onClick={handleModerateRisk}
											className={cn(
												"px-3 py-2 text-xs transition-colors text-left",
												currentScenario === 'moderate_risk'
													? "bg-yellow-900/50 border border-yellow-600 text-yellow-300"
													: "bg-yellow-900/20 hover:bg-yellow-800/30 border border-yellow-800 text-yellow-400"
											)}
										>
											Moderate Risk (10-25% threshold)
										</button>
										<button
											onClick={handleHighRisk}
											className={cn(
												"px-3 py-2 text-xs transition-colors text-left",
												currentScenario === 'high_risk'
													? "bg-orange-900/50 border border-orange-600 text-orange-300"
													: "bg-orange-900/20 hover:bg-orange-800/30 border border-orange-800 text-orange-400"
											)}
										>
											High Risk (25-75% threshold)
										</button>
										<button
											onClick={handleCriticalRisk}
											className={cn(
												"px-3 py-2 text-xs transition-colors text-left",
												currentScenario === 'critical_risk'
													? "bg-red-900/50 border border-red-600 text-red-300"
													: "bg-red-900/20 hover:bg-red-800/30 border border-red-800 text-red-400"
											)}
										>
											Critical Risk (75%+ threshold)
>>>>>>> fork-meter-simplified
										</button>
									</div>
								</div>
							</div>
						</section>
					</div>
				</div>
			</div>
		</>
	)
}
