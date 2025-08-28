import type { ForkRiskData } from '../types/gauge'

type ForkRiskLevel = ForkRiskData['riskLevel']

// Constants from the actual fork risk calculation
const FORK_THRESHOLD_REP = 275000 // 2.5% of 11 million REP
<<<<<<< HEAD
const MINIMUM_SECURITY_MULTIPLIER = 3
const TARGET_SECURITY_MULTIPLIER = 5

// Risk level thresholds (percentage of fork threshold)
const RISK_LEVELS = {
	CRITICAL: 80, // 80% of fork threshold
	HIGH: 60, // 60% of fork threshold
	MODERATE: 30, // 30% of fork threshold
}

/**
 * Generate realistic ForkRiskData based on desired risk percentage
 * This reverse-engineers the actual fork risk calculation to create coherent demo data
 */
export const generateDemoForkRiskData = (targetRiskPercentage: number): ForkRiskData => {
	// Clamp risk percentage to valid range
	const riskPercentage = Math.max(0, Math.min(100, targetRiskPercentage))
	
	// Determine risk level based on percentage
	let riskLevel: ForkRiskLevel
	if (riskPercentage >= 80) {
		riskLevel = 'critical'
	} else if (riskPercentage >= 60) {
		riskLevel = 'high'
	} else if (riskPercentage >= 30) {
		riskLevel = 'moderate'
	} else {
		riskLevel = 'low'
	}

	// Calculate dispute bond size - work backwards from risk percentage
	// Base risk formula: baseRisk = Math.min(50, (forkThresholdPercent / 10) * 50)
	// So: forkThresholdPercent = (baseRisk * 10) / 50
	const baseRiskComponent = Math.min(50, riskPercentage * 0.6) // 60% of risk from disputes
	const forkThresholdPercent = (baseRiskComponent * 10) / 50
	const largestDisputeBond = Math.floor((forkThresholdPercent / 100) * FORK_THRESHOLD_REP)

	// Calculate security ratio - remaining risk comes from poor security
	const securityRiskComponent = riskPercentage - baseRiskComponent
	let securityRatio: number
	
	if (securityRiskComponent > 0) {
		// Security ratio below target contributes to risk
		// securityRisk = ((TARGET - current) / TARGET) * 50
		// So: current = TARGET - (securityRisk * TARGET / 50)
		securityRatio = TARGET_SECURITY_MULTIPLIER - (securityRiskComponent * TARGET_SECURITY_MULTIPLIER / 50)
		securityRatio = Math.max(MINIMUM_SECURITY_MULTIPLIER * 0.5, securityRatio) // Don't go too low
	} else {
		// Low risk - good security ratio
		securityRatio = TARGET_SECURITY_MULTIPLIER + Math.random() * 10 // 5-15x ratio
	}

	// Generate market cap and open interest from security ratio
	const baseOpenInterest = 50000000 + Math.random() * 30000000 // $50-80M base
	const repMarketCap = baseOpenInterest * securityRatio

	// Generate active disputes based on risk level
	let activeDisputes: number
	let disputeDetails: Array<{
		marketId: string
		title: string
		disputeBondSize: number
		disputeRound: number
		daysRemaining: number
	}>

	if (largestDisputeBond > 0) {
		if (riskPercentage >= 80) {
			activeDisputes = Math.floor(Math.random() * 8) + 5 // 5-12 disputes
		} else if (riskPercentage >= 60) {
			activeDisputes = Math.floor(Math.random() * 5) + 3 // 3-7 disputes
		} else if (riskPercentage >= 30) {
			activeDisputes = Math.floor(Math.random() * 3) + 2 // 2-4 disputes
		} else {
			activeDisputes = Math.floor(Math.random() * 2) + 1 // 1-2 disputes
		}

		// Generate realistic dispute details
		disputeDetails = Array.from({ length: Math.min(activeDisputes, 5) }, (_, i) => ({
			marketId: `0x${Math.random().toString(16).substring(2, 42).padStart(40, '0')}`,
			title: getDemoMarketTitle(i),
			disputeBondSize: i === 0 ? largestDisputeBond : Math.floor(largestDisputeBond * (0.3 + Math.random() * 0.5)),
			disputeRound: Math.floor(Math.random() * 3) + 1,
			daysRemaining: Math.floor(Math.random() * 6) + 1,
		}))
	} else {
		activeDisputes = 0
		disputeDetails = []
	}

	const now = new Date()
	
	return {
		timestamp: now.toISOString(),
		blockNumber: Math.floor(Math.random() * 1000000) + 20000000,
		riskLevel,
		riskPercentage: Math.round(riskPercentage * 100) / 100,
		metrics: {
			largestDisputeBond,
			forkThresholdPercent: Math.round(forkThresholdPercent * 100) / 100,
			repMarketCap: Math.round(repMarketCap),
			openInterest: Math.round(baseOpenInterest),
			securityRatio: Math.round(securityRatio * 100) / 100,
			activeDisputes,
			disputeDetails,
		},
		nextUpdate: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
		rpcInfo: {
			endpoint: 'Demo Mode Simulation',
			latency: Math.floor(Math.random() * 200) + 100,
			fallbacksAttempted: 0,
			isPublicRpc: true,
		},
		calculation: {
			method: 'Demo Mode Simulation',
			forkThreshold: FORK_THRESHOLD_REP,
			securityMultiplier: {
				current: securityRatio,
				minimum: MINIMUM_SECURITY_MULTIPLIER,
				target: TARGET_SECURITY_MULTIPLIER,
			},
		},
	}
}

/**
 * Generate demo market titles for disputes
 */
const getDemoMarketTitle = (index: number): string => {
	const titles = [
		'Will the S&P 500 close above 5000 on December 31, 2024?',
		'Will Bitcoin reach $100,000 USD by the end of 2024?',
		'Will there be a recession in the US in 2024?',
		'Will AI achieve AGI (Artificial General Intelligence) by 2025?',
		'Will Ethereum transition fully to Proof of Stake succeed without major issues?',
		'Will the next US Presidential election be decided by less than 1% margin?',
		'Will global CO2 levels exceed 425 ppm in 2024?',
		'Will any country ban Bitcoin mining completely in 2024?',
	]
	
	return titles[index % titles.length]
}

/**
 * Generate demo data for specific risk scenarios
 */
export const generateLowRiskDemo = (): ForkRiskData => {
	const percentage = Math.random() * 25 // 0-25%
	return generateDemoForkRiskData(percentage)
}

export const generateMediumRiskDemo = (): ForkRiskData => {
	const percentage = 30 + Math.random() * 35 // 30-65%
	return generateDemoForkRiskData(percentage)
}

export const generateHighRiskDemo = (): ForkRiskData => {
	const percentage = 70 + Math.random() * 30 // 70-100%
	return generateDemoForkRiskData(percentage)
||||||| e90b0aa
=======

// Dispute bond scenarios aligned with risk levels
export enum DisputeBondScenario {
	NO_DISPUTES = 'no_disputes',
	LOW_RISK = 'low_risk',
	MODERATE_RISK = 'moderate_risk', 
	HIGH_RISK = 'high_risk',
	CRITICAL_RISK = 'critical_risk'
}

/**
 * Generate realistic ForkRiskData based on dispute bond scenario
 * Focuses on showcasing different dispute bond sizes rather than complex multi-factor scenarios
 */
export const generateDemoForkRiskData = (scenario: DisputeBondScenario): ForkRiskData => {
	let largestDisputeBond: number
	let riskLevel: ForkRiskLevel
	let riskPercentage: number
	let activeDisputes: number
	
	// Generate dispute bond scenarios aligned with risk levels
	switch (scenario) {
		case DisputeBondScenario.NO_DISPUTES:
			largestDisputeBond = 0
			activeDisputes = 0
			break
			
		case DisputeBondScenario.LOW_RISK:
			// Low risk bonds: 0.4-10% of threshold (1100-27500 REP)
			largestDisputeBond = 1100 + Math.floor(Math.random() * 26400)
			activeDisputes = Math.floor(Math.random() * 3) + 1 // 1-3 disputes
			break
			
		case DisputeBondScenario.MODERATE_RISK:
			// Moderate risk bonds: 10-25% of threshold (27500-68750 REP)
			largestDisputeBond = 27500 + Math.floor(Math.random() * 41250)
			activeDisputes = Math.floor(Math.random() * 4) + 2 // 2-5 disputes
			break
			
		case DisputeBondScenario.HIGH_RISK:
			// High risk bonds: 25-75% of threshold (68750-206250 REP)
			largestDisputeBond = 68750 + Math.floor(Math.random() * 137500)
			activeDisputes = Math.floor(Math.random() * 5) + 3 // 3-7 disputes
			break
			
		case DisputeBondScenario.CRITICAL_RISK:
			// Critical risk bonds: 75-98% of threshold (206250-269500 REP)
			largestDisputeBond = 206250 + Math.floor(Math.random() * 63250)
			activeDisputes = Math.floor(Math.random() * 8) + 4 // 4-11 disputes
			break
	}

	// Remove complex market metrics - focus purely on dispute bond scenarios

	// Generate dispute details based on the scenario
	let disputeDetails: Array<{
		marketId: string
		title: string
		disputeBondSize: number
		disputeRound: number
		daysRemaining: number
	}>

	if (activeDisputes > 0) {
		// Generate realistic dispute details focused on the bond sizes
		disputeDetails = Array.from({ length: Math.min(activeDisputes, 5) }, (_, i) => ({
			marketId: `0x${Math.random().toString(16).substring(2, 42).padStart(40, '0')}`,
			title: getDemoMarketTitle(i),
			disputeBondSize: i === 0 ? largestDisputeBond : generateVariedBondSize(largestDisputeBond, scenario),
			disputeRound: Math.floor(Math.random() * 3) + 1,
			daysRemaining: Math.floor(Math.random() * 6) + 1,
		}))
	} else {
		disputeDetails = []
	}

	const now = new Date()
	const forkThresholdPercent = (largestDisputeBond / FORK_THRESHOLD_REP) * 100
	
	// Determine risk level based on actual fork threshold percentage
	if (forkThresholdPercent < 10) {
		riskLevel = 'low'
	} else if (forkThresholdPercent < 25) {
		riskLevel = 'moderate'
	} else if (forkThresholdPercent < 75) {
		riskLevel = 'high'
	} else {
		riskLevel = 'critical'
	}
	
	// Use the actual calculated percentage
	riskPercentage = forkThresholdPercent
	
	return {
		timestamp: now.toISOString(),
		blockNumber: Math.floor(Math.random() * 1000000) + 20000000,
		riskLevel,
		riskPercentage: Math.round(riskPercentage * 100) / 100,
		metrics: {
			largestDisputeBond,
			forkThresholdPercent: Math.round(forkThresholdPercent * 100) / 100,
			activeDisputes,
			disputeDetails,
		},
		nextUpdate: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
		rpcInfo: {
			endpoint: 'Demo Mode - Dispute Bond Simulation',
			latency: Math.floor(Math.random() * 200) + 100,
			fallbacksAttempted: 0,
			isPublicRpc: true,
		},
		calculation: {
			method: 'Demo Mode - Focus on Dispute Bond Scenarios',
			forkThreshold: FORK_THRESHOLD_REP,
		},
	}
}

/**
 * Generate varied bond sizes for additional disputes based on the main scenario
 */
const generateVariedBondSize = (largestBond: number, scenario: DisputeBondScenario): number => {
	switch (scenario) {
		case DisputeBondScenario.LOW_RISK:
			return Math.floor(largestBond * (0.2 + Math.random() * 0.6)) // 20%-80% of largest
		case DisputeBondScenario.MODERATE_RISK:
			return Math.floor(largestBond * (0.3 + Math.random() * 0.5)) // 30%-80% of largest
		case DisputeBondScenario.HIGH_RISK:
			return Math.floor(largestBond * (0.4 + Math.random() * 0.4)) // 40%-80% of largest
		case DisputeBondScenario.CRITICAL_RISK:
			return Math.floor(largestBond * (0.5 + Math.random() * 0.3)) // 50%-80% of largest
		default:
			return Math.floor(largestBond * 0.5)
	}
}

/**
 * Generate demo market titles for disputes
 */
const getDemoMarketTitle = (index: number): string => {
	const titles = [
		'Will the S&P 500 close above 5000 on December 31, 2024?',
		'Will Bitcoin reach $100,000 USD by the end of 2024?',
		'Will there be a recession in the US in 2024?',
		'Will AI achieve AGI (Artificial General Intelligence) by 2025?',
		'Will Ethereum transition fully to Proof of Stake succeed without major issues?',
		'Will the next US Presidential election be decided by less than 1% margin?',
		'Will global CO2 levels exceed 425 ppm in 2024?',
		'Will any country ban Bitcoin mining completely in 2024?',
	]
	
	return titles[index % titles.length]
}

/**
 * Generate demo data for specific risk level scenarios
 */
export const generateNoDisputesDemo = (): ForkRiskData => {
	return generateDemoForkRiskData(DisputeBondScenario.NO_DISPUTES)
}

export const generateLowRiskDemo = (): ForkRiskData => {
	return generateDemoForkRiskData(DisputeBondScenario.LOW_RISK)
}

export const generateModerateRiskDemo = (): ForkRiskData => {
	return generateDemoForkRiskData(DisputeBondScenario.MODERATE_RISK)
}

export const generateHighRiskDemo = (): ForkRiskData => {
	return generateDemoForkRiskData(DisputeBondScenario.HIGH_RISK)
}

export const generateCriticalRiskDemo = (): ForkRiskData => {
	return generateDemoForkRiskData(DisputeBondScenario.CRITICAL_RISK)
}

// Legacy functions for backward compatibility (map to new risk-aligned scenarios)
export const generateSmallBondsDemo = (): ForkRiskData => {
	return generateLowRiskDemo()
}

export const generateMediumBondsDemo = (): ForkRiskData => {
	return generateModerateRiskDemo()
}

export const generateLargeBondsDemo = (): ForkRiskData => {
	return generateCriticalRiskDemo()
}

export const generateMediumRiskDemo = (): ForkRiskData => {
	return generateModerateRiskDemo()
>>>>>>> fork-meter-simplified
}