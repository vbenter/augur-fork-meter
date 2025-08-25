import type React from 'react'
import { useState, useCallback } from 'react'
import { cn } from '../lib/utils'
import { DemoSidebar } from './DemoSidebar'
import { useDemo } from '../contexts/DemoContext'

interface DemoOverlayProps {
	children: React.ReactNode
}

export const DemoOverlay = ({ children }: DemoOverlayProps) => {
	const [isDebugOpen, setIsDebugOpen] = useState<boolean>(false)
	const { isDemo, resetToLive } = useDemo()

	const handleToggleDebug = useCallback(() => {
		setIsDebugOpen((prev) => !prev)
	}, [])

	const handleCloseDebug = useCallback(() => {
		setIsDebugOpen(false)
	}, [])

	return (
		<>
			{/* Fixed Top Bar with Demo Controls */}
			<div className={cn(
				'fixed top-0 left-0 right-0 z-30 transition-all duration-300',
				isDemo 
					? 'bg-white/5' 
					: 'bg-transparent'
			)}>
				<div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
					{/* Demo Text - Left Side */}
					{isDemo && (
						<div className="text-sm text-green-400">
							Demo Mode
						</div>
					)}
					
					{/* Spacer when not in demo mode */}
					{!isDemo && <div />}
					
					{/* Buttons - Right Side */}
					<div className="flex items-center gap-2">
						{/* Settings Button */}
						<button
							onClick={handleToggleDebug}
							className={cn(
								'px-3 py-1.5 text-sm transition-colors',
								isDemo 
									? 'hover:bg-white/10 text-green-400 hover:text-green-300'
									: 'border border-primary/20 hover:border-primary/40 text-primary/60 hover:text-primary/80',
								isDebugOpen && (isDemo ? 'bg-white/10' : 'bg-primary/10 border-primary/60')
							)}
						>
							{isDemo ? 'Settings' : 'Demo'}
						</button>
						
						{/* Reset Button - Only in Demo Mode */}
						{isDemo && (
							<button
								onClick={resetToLive}
								className="px-3 py-1.5 text-sm border border-green-400/50 hover:border-green-400/70 text-green-400 hover:text-green-300 transition-colors"
							>
								Reset
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="pt-20">
				{children}
			</div>

			{/* Demo Sidebar */}
			<DemoSidebar
				isOpen={isDebugOpen}
				onClose={handleCloseDebug}
			/>
		</>
	)
}