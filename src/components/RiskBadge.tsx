import type React from 'react'
import { cn } from '../lib/utils'

interface RiskBadgeProps {
	level: 'Low' | 'Medium' | 'High' | 'Critical'
}

export const RiskBadge = ({ level }: RiskBadgeProps): React.JSX.Element => {
	const getTextColor = (level: string) => {
		switch (level) {
			case 'Low':
				return 'text-[color:var(--gauge-color-safe)]'
			case 'Medium':
				return 'text-[color:var(--gauge-color-warning)]'
			case 'High':
				return 'text-[color:var(--gauge-color-critical)]'
			case 'Critical':
				return 'text-red-500 animate-pulse'
			default:
				return 'text-white'
		}
	}

	return <span className={getTextColor(level)}>{level}</span>
}
