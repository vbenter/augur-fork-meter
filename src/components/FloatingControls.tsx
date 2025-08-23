import type React from 'react'
import { cn } from '../lib/utils'
import type { FloatingControlsProps } from '../types/gauge'

export const FloatingControls = ({
	percentage,
	onSliderChange,
	onLowRiskClick,
	onMediumRiskClick,
	onHighRiskClick,
	isPanelExpanded,
	onTogglePanel,
}: FloatingControlsProps): React.JSX.Element => {
	const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseFloat(e.target.value)
		onSliderChange(value)
	}

	return (
		<div className="fixed bottom-5 right-5 z-[1000]">
			<div
				className={cn(
					'bg-gray-900/95 rounded-xl p-5 backdrop-blur border border-primary/30 flex flex-col gap-4 min-w-[300px] transition-transform duration-300 ease-in-out',
					isPanelExpanded ? 'translate-x-0' : 'translate-x-[calc(100%+20px)]',
				)}
			>
				<div className="text-xs uppercase tracking-[0.1em] font-light text-muted-primary mb-2">
					Use slider for manual control or select scenario buttons
				</div>

				<div className="flex items-center gap-2.5">
					<label
						htmlFor="percentageSlider"
						className="text-sm min-w-[60px] font-light tracking-[0.1em] uppercase text-muted-primary"
					>
						MANUAL:
					</label>
					<input
						type="range"
						id="percentageSlider"
						min="0"
						max="100"
						value={percentage}
						step="0.1"
						onChange={handleSliderChange}
						className="flex-1 h-1.5 rounded-sm bg-white/20 outline-none appearance-none slider"
					/>
				</div>

				<div className="text-sm font-light tracking-[0.1em] uppercase text-muted-primary mb-1">
					SCENARIOS:
				</div>

				<div className="flex flex-col gap-2">
					<button
						onClick={onLowRiskClick}
						className="px-4 py-2 text-white border border-[color:var(--gauge-color-safe)]/50 bg-[color:var(--gauge-color-safe)]/10 rounded-md cursor-pointer text-sm font-light tracking-[0.1em] uppercase transition-all duration-300 whitespace-nowrap hover:bg-[color:var(--gauge-color-safe)]/20 hover:border-[color:var(--gauge-color-safe)]"
					>
						Low Risk
					</button>
					<button
						onClick={onMediumRiskClick}
						className="px-4 py-2 text-white border border-[color:var(--gauge-color-warning)]/50 bg-[color:var(--gauge-color-warning)]/10 rounded-md cursor-pointer text-sm font-light tracking-[0.1em] uppercase transition-all duration-300 whitespace-nowrap hover:bg-[color:var(--gauge-color-warning)]/20 hover:border-[color:var(--gauge-color-warning)]"
					>
						Medium Risk
					</button>
					<button
						onClick={onHighRiskClick}
						className="px-4 py-2 text-white border border-[color:var(--gauge-color-critical)]/50 bg-[color:var(--gauge-color-critical)]/10 rounded-md cursor-pointer text-sm font-light tracking-[0.1em] uppercase transition-all duration-300 whitespace-nowrap hover:bg-[color:var(--gauge-color-critical)]/20 hover:border-[color:var(--gauge-color-critical)]"
					>
						High Risk
					</button>
				</div>

				<button
					className="absolute -left-10 top-1/2 -translate-y-1/2 w-10 h-15 bg-gray-900/95 border border-primary/30 border-r-0 rounded-l-lg text-muted-primary cursor-pointer flex items-center justify-center text-lg transition-colors duration-300 hover:bg-gray-800/95 hover:text-muted-primary"
					onClick={onTogglePanel}
				>
					⚙
				</button>
			</div>
		</div>
	)
}
