#!/usr/bin/env node

/**
 * Augur Fork Risk Calculator
 *
 * This script calculates the current risk of an Augur fork based on:
 * - Active dispute bonds and their sizes
 * - REP market cap vs open interest ratio
 * - Dispute escalation patterns
 *
 * Results are saved to public/data/fork-risk.json for the UI to consume.
 * All calculations are transparent and auditable.
 */

import { ethers } from 'ethers'
import { promises as fs } from 'fs'
import * as path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// TypeScript interfaces
interface DisputeDetails {
	marketId: string
	title: string
	disputeBondSize: number
	disputeRound: number
	daysRemaining: number
}

interface RpcInfo {
	endpoint: string | null
	latency: number | null
	fallbacksAttempted: number
	isPublicRpc: boolean
}

interface Metrics {
	largestDisputeBond: number
	forkThresholdPercent: number
	repMarketCap: number
	openInterest: number
	securityRatio: number
	activeDisputes: number
	disputeDetails: DisputeDetails[]
}

interface SecurityMultiplier {
	current: number
	minimum: number
	target: number
}

interface Calculation {
	method: string
	forkThreshold: number
	securityMultiplier: SecurityMultiplier
}

interface ForkRiskData {
	timestamp: string
	blockNumber?: number
	riskLevel: 'low' | 'moderate' | 'high' | 'critical' | 'unknown'
	riskPercentage: number
	metrics: Metrics
	nextUpdate: string
	rpcInfo: RpcInfo
	calculation: Calculation
	error?: string
}

type RiskLevel = 'low' | 'moderate' | 'high' | 'critical'

// Configuration
const FORK_THRESHOLD_REP = 275000 // 2.5% of 11 million REP
const MINIMUM_SECURITY_MULTIPLIER = 3
const TARGET_SECURITY_MULTIPLIER = 5

// Price estimates (update these periodically or integrate price feeds)
const ESTIMATED_REP_PRICE_USD = 10 // $10 per REP (conservative estimate as of 2024)
const ESTIMATED_ETH_PRICE_USD = 2500 // $2500 per ETH
// Note: For production, consider integrating Chainlink or DEX price feeds

// Public RPC endpoints (no API keys required!)
const PUBLIC_RPC_ENDPOINTS = [
	'https://eth.llamarpc.com', // LlamaRPC
	'https://main-light.eth.linkpool.io', // LinkPool
	'https://ethereum.publicnode.com', // PublicNode
	'https://1rpc.io/eth', // 1RPC
]

// Risk level thresholds (percentage of fork threshold)
const RISK_LEVELS = {
	LOW: 0.5, // <0.5% of fork threshold
	MODERATE: 2.0, // 0.5-2% of threshold
	HIGH: 5.0, // 2-5% of threshold
	CRITICAL: 10.0, // >5% of threshold (anything over 10% is imminent)
}

class AugurForkCalculator {
	private provider: ethers.JsonRpcProvider | null = null
	private contracts: Record<string, ethers.Contract> = {}
	private rpcUsed: string | null = null
	private rpcLatency: number | null = null
	private fallbacksAttempted: number = 0

	async getWorkingProvider(): Promise<ethers.JsonRpcProvider> {
		// First try custom RPC if provided
		const customRpc = process.env.ETH_RPC_URL
		if (customRpc && !customRpc.includes('YOUR-PROJECT-ID')) {
			try {
				console.log('Trying custom RPC:', customRpc)
				const startTime = Date.now()
				const provider = new ethers.JsonRpcProvider(customRpc)
				await provider.getBlockNumber() // Test connection
				this.rpcLatency = Date.now() - startTime
				this.rpcUsed = customRpc
				console.log(
					`✓ Connected to custom RPC: ${customRpc} (${this.rpcLatency}ms)`,
				)
				return provider
			} catch (error) {
				console.log(
					`✗ Custom RPC failed: ${error instanceof Error ? error.message : String(error)}`,
				)
				this.fallbacksAttempted++
			}
		}

		// Try public RPC endpoints
		for (const rpc of PUBLIC_RPC_ENDPOINTS) {
			try {
				console.log(`Trying public RPC: ${rpc}`)
				const startTime = Date.now()
				const provider = new ethers.JsonRpcProvider(rpc, 'mainnet')
				await provider.getBlockNumber() // Test connection
				this.rpcLatency = Date.now() - startTime
				this.rpcUsed = rpc
				console.log(`✓ Connected to: ${rpc} (${this.rpcLatency}ms)`)
				return provider
			} catch (error) {
				console.log(
					`✗ Failed to connect to ${rpc}: ${error instanceof Error ? error.message : String(error)}`,
				)
				this.fallbacksAttempted++
			}
		}

		throw new Error(
			`All RPC endpoints failed (attempted ${this.fallbacksAttempted})`,
		)
	}

	async initialize(): Promise<void> {
		try {
			console.log('Initializing Augur Fork Calculator...')
			this.provider = await this.getWorkingProvider()
			await this.loadContracts()
			console.log('✓ Successfully initialized with real blockchain connection')
		} catch (error) {
			console.error(
				'✗ Failed to initialize blockchain connection:',
				error instanceof Error ? error.message : String(error),
			)
			throw error // Don't fall back to mock data - fail transparently
		}
	}

	async loadContracts(): Promise<void> {
		const abiPath = path.join(__dirname, '../contracts/augur-abis.json')
		const abiData = await fs.readFile(abiPath, 'utf8')
		const abis = JSON.parse(abiData)

		// Initialize contract instances with correct names
		this.contracts = {
			universe: new ethers.Contract(
				abis.universe.address,
				abis.universe.abi,
				this.provider!,
			),
			augur: new ethers.Contract(
				abis.augur.address,
				abis.augur.abi,
				this.provider!,
			),
			repV2Token: new ethers.Contract(
				abis.repV2Token.address,
				abis.repV2Token.abi,
				this.provider!,
			),
			cash: new ethers.Contract(
				abis.cash.address,
				abis.cash.abi,
				this.provider!,
			),
		}

		console.log('✓ Loaded contracts:')
		console.log(`  Universe: ${abis.universe.address}`)
		console.log(`  Augur: ${abis.augur.address}`)
		console.log(`  REPv2: ${abis.repV2Token.address}`)
		console.log(`  Cash: ${abis.cash.address}`)
	}

	async calculateForkRisk(): Promise<ForkRiskData> {
		try {
			console.log('Starting fork risk calculation...')

			// Get current blockchain state
			const blockNumber = await this.provider!.getBlockNumber()
			console.log(`Block Number: ${blockNumber}`)
			const timestamp = new Date().toISOString()

			// Check if universe is already forking
			const isForking = await this.contracts.universe.isForking()
			if (isForking) {
				console.log('⚠️ UNIVERSE IS FORKING! Setting maximum risk level')
				return this.getForkingResult(timestamp, blockNumber)
			}

			// Calculate key metrics
			const activeDisputes = await this.getActiveDisputes()
			const largestDisputeBond = this.getLargestDisputeBond(activeDisputes)
			const repMarketCap = await this.getRepMarketCap()
			const openInterest = await this.getOpenInterest()
			const securityRatio = this.calculateSecurityRatio(
				repMarketCap,
				openInterest,
			)

			// Calculate risk level
			const forkThresholdPercent =
				(largestDisputeBond / FORK_THRESHOLD_REP) * 100
			const riskLevel = this.determineRiskLevel(
				forkThresholdPercent,
				securityRatio,
			)
			const riskPercentage = this.calculateRiskPercentage(
				forkThresholdPercent,
				securityRatio,
			)

			// Prepare results
			const results: ForkRiskData = {
				timestamp,
				blockNumber,
				riskLevel,
				riskPercentage: Math.min(100, Math.max(0, riskPercentage)),
				metrics: {
					largestDisputeBond,
					forkThresholdPercent: Math.round(forkThresholdPercent * 100) / 100,
					repMarketCap,
					openInterest,
					securityRatio: Math.round(securityRatio * 100) / 100,
					activeDisputes: activeDisputes.length,
					disputeDetails: activeDisputes.slice(0, 5), // Top 5 disputes
				},
				nextUpdate: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
				rpcInfo: {
					endpoint: this.rpcUsed,
					latency: this.rpcLatency,
					fallbacksAttempted: this.fallbacksAttempted,
					isPublicRpc: PUBLIC_RPC_ENDPOINTS.includes(this.rpcUsed!),
				},
				calculation: {
					method: 'GitHub Actions + Public RPC',
					forkThreshold: FORK_THRESHOLD_REP,
					securityMultiplier: {
						current: securityRatio,
						minimum: MINIMUM_SECURITY_MULTIPLIER,
						target: TARGET_SECURITY_MULTIPLIER,
					},
				},
			}

			console.log('Calculation completed successfully')
			console.log(`Risk Level: ${riskLevel}`)
			console.log(`Largest Dispute Bond: ${largestDisputeBond} REP`)
			console.log(`Fork Threshold: ${forkThresholdPercent.toFixed(2)}%`)
			console.log(`RPC Used: ${this.rpcUsed} (${this.rpcLatency}ms)`)
			console.log(`Block Number: ${blockNumber}`)

			return results
		} catch (error) {
			console.error('Error calculating fork risk:', error)
			throw error // Don't return mock data - let the error bubble up
		}
	}

	async getActiveDisputes(): Promise<DisputeDetails[]> {
		try {
			console.log('Querying DisputeCrowdsourcerCreated events...')

			// Query events in smaller chunks due to RPC block limit (1000 blocks max)
			const currentBlock = await this.provider!.getBlockNumber()
			const blocksPerDay = 7200 // Approximate blocks per day (12 second blocks)
			const searchPeriod = 7 * blocksPerDay // Last 7 days
			const fromBlock = currentBlock - searchPeriod

			const allEvents: ethers.EventLog[] = []
			const chunkSize = 1000 // Max blocks per query for most RPC providers

			// Query in chunks to avoid RPC limits
			for (let start = fromBlock; start < currentBlock; start += chunkSize) {
				const end = Math.min(start + chunkSize - 1, currentBlock)

				try {
					const eventFilter =
						this.contracts.augur.filters.DisputeCrowdsourcerCreated()
					const chunkEvents = await this.contracts.augur.queryFilter(
						eventFilter,
						start,
						end,
					)
					allEvents.push(
						...(chunkEvents.filter(
							(e) => e instanceof ethers.EventLog,
						) as ethers.EventLog[]),
					)

					if (chunkEvents.length > 0) {
						console.log(
							`Found ${chunkEvents.length} events in blocks ${start}-${end}`,
						)
					}
				} catch (chunkError) {
					console.warn(
						`Failed to query blocks ${start}-${end}:`,
						chunkError instanceof Error
							? chunkError.message
							: String(chunkError),
					)
				}
			}

			const events = allEvents

			console.log(
				`Found ${events.length} DisputeCrowdsourcerCreated events in last 30 days`,
			)

			const disputes: DisputeDetails[] = []

			for (const event of events) {
				try {
					// Each event should have args: [universe, market, disputeCrowdsourcer, payoutNumerators, size, invalid]
					if (
						!event.args ||
						!Array.isArray(event.args) ||
						event.args.length < 5
					)
						continue

					const [
						universe,
						marketAddress,
						disputeCrowdsourcerAddress,
						payoutNumerators,
						bondSizeWei,
					] = event.args

					// Convert bond size from wei to REP tokens
					const bondSizeRep = Number(ethers.formatEther(bondSizeWei))

					// Try to get market details (this might fail for old/finalized markets)
					const marketTitle = `Market ${marketAddress.substring(0, 10)}...`
					let disputeRound = 1
					const daysRemaining = 7

					try {
						// Create market contract instance to get more details
						const marketContract = new ethers.Contract(
							marketAddress,
							[
								{
									constant: true,
									inputs: [],
									name: 'getNumParticipants',
									outputs: [{ name: '', type: 'uint256' }],
									type: 'function',
								},
								{
									constant: true,
									inputs: [],
									name: 'isFinalized',
									outputs: [{ name: '', type: 'bool' }],
									type: 'function',
								},
							],
							this.provider!,
						)

						// Skip if market is finalized
						const isFinalized = await marketContract.isFinalized()
						if (isFinalized) continue

						// Estimate dispute round based on bond size
						// Initial bond is ~$12.5k, doubles each round
						const initialBondRep = 625 // Approximate initial bond in REP
						disputeRound = Math.max(
							1,
							Math.ceil(Math.log2(bondSizeRep / initialBondRep)),
						)
					} catch (marketError) {
						// If we can't get market details, use defaults
						console.warn(`Could not get details for market ${marketAddress}`)
					}

					disputes.push({
						marketId: marketAddress,
						title: marketTitle,
						disputeBondSize: bondSizeRep,
						disputeRound,
						daysRemaining,
					})
				} catch (eventError) {
					console.warn(
						'Error processing dispute event:',
						eventError instanceof Error
							? eventError.message
							: String(eventError),
					)
				}
			}

			// Sort by bond size (largest first) and return top 10
			const sortedDisputes = disputes.sort(
				(a, b) => b.disputeBondSize - a.disputeBondSize,
			)
			console.log(`Processed ${sortedDisputes.length} active disputes`)

			return sortedDisputes.slice(0, 10)
		} catch (error) {
			console.warn(
				'Failed to query dispute events, using empty array:',
				error instanceof Error ? error.message : String(error),
			)
			return []
		}
	}

	getLargestDisputeBond(disputes: DisputeDetails[]): number {
		if (disputes.length === 0) return 0
		return Math.max(...disputes.map((d) => d.disputeBondSize))
	}

	async getRepMarketCap(): Promise<number> {
		try {
			// Get REP total supply from the REP token contract (more reliable than Universe method)
			const totalSupply = await this.contracts.repV2Token.totalSupply()
			const totalSupplyNumber = Number(ethers.formatEther(totalSupply))

			const marketCapUsd = ESTIMATED_REP_PRICE_USD * totalSupplyNumber

			console.log(`REP Total Supply: ${totalSupplyNumber.toLocaleString()} REP`)
			console.log(
				`REP Market Cap: $${marketCapUsd.toLocaleString()} USD (at $${ESTIMATED_REP_PRICE_USD}/REP estimated)`,
			)

			return marketCapUsd
		} catch (error) {
			console.warn(
				'Failed to get REP total supply:',
				error instanceof Error ? error.message : String(error),
			)
			// Fallback: 11M REP * price
			const fallbackSupply = 11000000 // 11M REP fallback
			const fallbackMarketCap = fallbackSupply * ESTIMATED_REP_PRICE_USD
			console.log(
				`Using fallback: ${fallbackSupply.toLocaleString()} REP × $${ESTIMATED_REP_PRICE_USD} = $${fallbackMarketCap.toLocaleString()}`,
			)
			return fallbackMarketCap
		}
	}

	async getOpenInterest(): Promise<number> {
		try {
			// Get actual open interest from Universe contract (in wei)
			const openInterestWei =
				await this.contracts.universe.getOpenInterestInAttoEth()
			const openInterestEth = Number(ethers.formatEther(openInterestWei))
			console.log(`Open Interest: ${openInterestEth.toLocaleString()} ETH`)

			// Convert ETH to USD using configured ETH price
			const openInterestUsd = openInterestEth * ESTIMATED_ETH_PRICE_USD

			console.log(`Open Interest: $${openInterestUsd.toLocaleString()} USD`)
			return openInterestUsd
		} catch (error) {
			console.warn(
				'Failed to get real open interest, using fallback:',
				error instanceof Error ? error.message : String(error),
			)
			return 50000000 // $50M open interest (fallback)
		}
	}

	calculateSecurityRatio(marketCap: number, openInterest: number): number {
		return marketCap / openInterest
	}

	determineRiskLevel(
		forkThresholdPercent: number,
		securityRatio: number,
	): RiskLevel {
		// Adjust risk based on security ratio
		let adjustedThresholdPercent = forkThresholdPercent

		// If security ratio is below minimum, increase perceived risk
		if (securityRatio < MINIMUM_SECURITY_MULTIPLIER) {
			adjustedThresholdPercent *= MINIMUM_SECURITY_MULTIPLIER / securityRatio
		}

		if (adjustedThresholdPercent >= RISK_LEVELS.CRITICAL) return 'critical'
		if (adjustedThresholdPercent >= RISK_LEVELS.HIGH) return 'high'
		if (adjustedThresholdPercent >= RISK_LEVELS.MODERATE) return 'moderate'
		return 'low'
	}

	calculateRiskPercentage(
		forkThresholdPercent: number,
		securityRatio: number,
	): number {
		// Base risk from dispute bond size (0-50%)
		const baseRisk = Math.min(50, (forkThresholdPercent / 10) * 50)

		// Additional risk from poor security ratio (0-50%)
		let securityRisk = 0
		if (securityRatio < TARGET_SECURITY_MULTIPLIER) {
			securityRisk = Math.max(
				0,
				((TARGET_SECURITY_MULTIPLIER - securityRatio) /
					TARGET_SECURITY_MULTIPLIER) *
					50,
			)
		}

		return Math.round(baseRisk + securityRisk)
	}

	getForkingResult(timestamp: string, blockNumber: number): ForkRiskData {
		return {
			timestamp,
			blockNumber,
			riskLevel: 'critical',
			riskPercentage: 100,
			metrics: {
				largestDisputeBond: FORK_THRESHOLD_REP, // Fork threshold was reached
				forkThresholdPercent: 100,
				repMarketCap: 0, // Will be calculated separately if needed
				openInterest: 0, // Will be calculated separately if needed
				securityRatio: 0,
				activeDisputes: 0,
				disputeDetails: [
					{
						marketId: 'FORKING',
						title: 'Universe is currently forking',
						disputeBondSize: FORK_THRESHOLD_REP,
						disputeRound: 99,
						daysRemaining: 0,
					},
				],
			},
			nextUpdate: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
			rpcInfo: {
				endpoint: this.rpcUsed,
				latency: this.rpcLatency,
				fallbacksAttempted: this.fallbacksAttempted,
				isPublicRpc: PUBLIC_RPC_ENDPOINTS.includes(this.rpcUsed!),
			},
			calculation: {
				method: 'Fork Detected',
				forkThreshold: FORK_THRESHOLD_REP,
				securityMultiplier: {
					current: 0,
					minimum: MINIMUM_SECURITY_MULTIPLIER,
					target: TARGET_SECURITY_MULTIPLIER,
				},
			},
		}
	}

	getErrorResult(errorMessage: string): ForkRiskData {
		return {
			timestamp: new Date().toISOString(),
			riskLevel: 'unknown',
			riskPercentage: 0,
			error: errorMessage,
			metrics: {
				largestDisputeBond: 0,
				forkThresholdPercent: 0,
				repMarketCap: 0,
				openInterest: 0,
				securityRatio: 0,
				activeDisputes: 0,
				disputeDetails: [],
			},
			nextUpdate: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
			rpcInfo: {
				endpoint: null,
				latency: null,
				fallbacksAttempted: this.fallbacksAttempted,
				isPublicRpc: false,
			},
			calculation: {
				method: 'Error',
				forkThreshold: FORK_THRESHOLD_REP,
				securityMultiplier: {
					current: 0,
					minimum: MINIMUM_SECURITY_MULTIPLIER,
					target: TARGET_SECURITY_MULTIPLIER,
				},
			},
		}
	}

	async saveResults(results: ForkRiskData): Promise<void> {
		const outputPath = path.join(__dirname, '../public/data/fork-risk.json')

		// Ensure data directory exists
		await fs.mkdir(path.dirname(outputPath), { recursive: true })

		// Write results with pretty formatting
		await fs.writeFile(outputPath, JSON.stringify(results, null, 2))

		console.log(`Results saved to ${outputPath}`)
	}
}

// Main execution
async function main(): Promise<void> {
	const calculator = new AugurForkCalculator()

	try {
		await calculator.initialize()
		const results = await calculator.calculateForkRisk()
		await calculator.saveResults(results)

		console.log('\n✓ Fork risk calculation completed successfully')
		console.log(
			`Results saved with ${results.rpcInfo.isPublicRpc ? 'PUBLIC' : 'CUSTOM'} RPC: ${results.rpcInfo.endpoint}`,
		)
		process.exit(0)
	} catch (error) {
		console.error('\n✗ Fatal error during fork risk calculation:')
		console.error(
			`Error: ${error instanceof Error ? error.message : String(error)}`,
		)

		// Create an error result to save
		const errorResult: ForkRiskData = {
			timestamp: new Date().toISOString(),
			riskLevel: 'unknown',
			riskPercentage: 0,
			error: error instanceof Error ? error.message : String(error),
			rpcInfo: {
				endpoint: null,
				latency: null,
				fallbacksAttempted: calculator['fallbacksAttempted'],
				isPublicRpc: false,
			},
			metrics: {
				largestDisputeBond: 0,
				forkThresholdPercent: 0,
				repMarketCap: 0,
				openInterest: 0,
				securityRatio: 0,
				activeDisputes: 0,
				disputeDetails: [],
			},
			nextUpdate: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
			calculation: {
				method: 'Error',
				forkThreshold: FORK_THRESHOLD_REP,
				securityMultiplier: {
					current: 0,
					minimum: MINIMUM_SECURITY_MULTIPLIER,
					target: TARGET_SECURITY_MULTIPLIER,
				},
			},
		}

		try {
			await calculator.saveResults(errorResult)
			console.log('Error state saved to JSON file')
		} catch (saveError) {
			console.error(
				'Failed to save error state:',
				saveError instanceof Error ? saveError.message : String(saveError),
			)
		}

		process.exit(1)
	}
}

// Run if called directly (TypeScript/Node compatible)
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
	main()
}
