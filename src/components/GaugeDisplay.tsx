import type React from 'react'
import { cn } from '../lib/utils'
import type { GaugeDisplayProps } from '../types/gauge'

export const GaugeDisplay = ({
	percentage,
}: GaugeDisplayProps): React.JSX.Element => {
	/**
	 * Convert fork threshold percentage to visual gauge percentage
	 * Maps the actual risk to intuitive visual representation
	 */
	const getVisualPercentage = (forkThresholdPercent: number): number => {
		if (forkThresholdPercent <= 10) {
			// 0-10% fork threshold = 0-25% gauge (Low risk zone)
			return (forkThresholdPercent / 10) * 25
		} else if (forkThresholdPercent <= 25) {
			// 10-25% fork threshold = 25-50% gauge (Moderate risk zone)
			return 25 + ((forkThresholdPercent - 10) / 15) * 25
		} else if (forkThresholdPercent <= 75) {
			// 25-75% fork threshold = 50-90% gauge (High risk zone)
			return 50 + ((forkThresholdPercent - 25) / 50) * 40
		} else {
			// 75%+ fork threshold = 90-100% gauge (Critical risk zone)
			return Math.min(100, 90 + ((forkThresholdPercent - 75) / 25) * 10)
		}
	}

	const updateArc = (actualPercentage: number): string => {
		// Use visual percentage for arc display
		const visualPercentage = getVisualPercentage(actualPercentage)
		
		// Calculate the end point of the arc based on visual percentage
		// Map percentage to angle from 180° to 0° (π to 0 radians)
		const angle = Math.PI - (visualPercentage / 100) * Math.PI
		const centerX = 200
		const centerY = 200
		const radius = 120

		// Calculate end point
		const endX = centerX + radius * Math.cos(angle)
		const endY = centerY - radius * Math.sin(angle)

		// Create arc path with gradient
		if (visualPercentage === 0) {
			return 'M 80 200'
		} else {
			// Always use sweep-flag = 1 for clockwise direction
			return `M 80 200 A 120 120 0 0 1 ${endX} ${endY}`
		}
	}

	const getRiskLevel = (forkThresholdPercent: number): string => {
		if (forkThresholdPercent < 10) return 'LOW'
		if (forkThresholdPercent < 25) return 'MODERATE'
		if (forkThresholdPercent < 75) return 'HIGH'
		return 'CRITICAL'
	}

	const getRiskColor = (forkThresholdPercent: number): string => {
		if (forkThresholdPercent < 10) return 'var(--gauge-color-safe)'
		if (forkThresholdPercent < 25) return 'var(--gauge-color-warning)'
		if (forkThresholdPercent < 75) return 'var(--gauge-color-danger)'
		return 'var(--gauge-color-critical)'
	}

	return (
		<div className={cn('relative mb-4 flex flex-col gap-y-1 items-center')}>
			<svg className="max-w-[200px] w-full" viewBox="60 60 280 160">
				<defs>
					<linearGradient
						id="pathGradient"
						x1="80"
						y1="200"
						x2="320"
						y2="200"
						gradientUnits="userSpaceOnUse"
					>
						<stop
							offset="0%"
							style={{ stopColor: 'var(--gauge-color-safe)' }}
						/>
						<stop
							offset="35%"
							style={{ stopColor: 'var(--gauge-color-safe-mid)' }}
						/>
						<stop
							offset="55%"
							style={{ stopColor: 'var(--gauge-color-warning)' }}
						/>
						<stop
							offset="80%"
							style={{ stopColor: 'var(--gauge-color-danger)' }}
						/>
						<stop
							offset="100%"
							style={{ stopColor: 'var(--gauge-color-critical)' }}
						/>
					</linearGradient>

					<filter id="glow" x="-200%" y="-200%" width="500%" height="500%">
						<feGaussianBlur stdDeviation="8" result="coloredBlur" />
						<feColorMatrix
							in="coloredBlur"
							type="matrix"
							values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 3 0"
						/>
						<feMerge>
							<feMergeNode in="coloredBlur" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>

				{/* Background track */}
				<path
					d="M 80 200 A 120 120 0 0 1 320 200"
					fill="none"
					stroke="var(--gauge-bg-color)"
					strokeWidth="var(--gauge-thickness)"
					strokeLinecap="round"
				/>

				{/* Dynamic colored arc with CSS glow */}
				<path
					d={updateArc(percentage)}
					fill="none"
					stroke="url(#pathGradient)"
					strokeWidth="var(--gauge-thickness)"
					strokeLinecap="round"
					style={{
						filter:
							'drop-shadow(0 0 0.5em oklch(from var(--color-primary) l c h / 0.5))',
					}}
				/>

				{/* Risk level text at baseline of arc */}
				<text
					x="200"
					y="195"
					textAnchor="middle"
					fill={getRiskColor(percentage)}
					fontSize="3em"
					fontWeight="bold"
				>
					{getRiskLevel(percentage)}
				</text>
			</svg>

			<div className="text-xl uppercase tracking-[0.2em] font-light text-muted-primary">
				FORK RISK LEVEL
			</div>
		</div>
	)
}
