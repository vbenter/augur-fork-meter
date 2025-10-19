#!/usr/bin/env node

/**
 * Augur Fork Risk Calculator
 *
 * This script calculates the current risk of an Augur fork based on:
 * - Active dispute bonds and their sizes relative to fork threshold
 *
 * Results are saved to public/data/fork-risk.json for the UI to consume.
 * All calculations are transparent and auditable.
 */

import { ethers } from 'ethers'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

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
}

interface Metrics {
	largestDisputeBond: number
	forkThresholdPercent: number
	activeDisputes: number
	disputeDetails: DisputeDetails[]
}

interface Calculation {
	method: string
	forkThreshold: number
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
const FORK_THRESHOLD_REP = 201715

// Public RPC endpoints (no API keys required!)
const PUBLIC_RPC_ENDPOINTS = [
	'https://eth.llamarpc.com', // LlamaRPC
	'https://main-light.eth.linkpool.io', // LinkPool
	'https://ethereum.publicnode.com', // PublicNode
	'https://1rpc.io/eth', // 1RPC
]

interface RpcConnection {
	provider: ethers.JsonRpcProvider
	endpoint: string
	latency: number
	fallbacksAttempted: number
}

// Risk level thresholds (percentage of fork threshold)
const RISK_LEVELS = {
	LOW: 10, // <10% of fork threshold
	MODERATE: 25, // 10-25% of threshold
	HIGH: 75, // 25-75% of threshold
	CRITICAL: 75, // >75% of threshold
}

async function getWorkingProvider(): Promise<RpcConnection> {
	let fallbacksAttempted = 0

	// Try public RPC endpoints
	for (const rpc of PUBLIC_RPC_ENDPOINTS) {
		try {
			console.log(`Trying public RPC: ${rpc}`)
			const startTime = Date.now()
			const provider = new ethers.JsonRpcProvider(rpc, 'mainnet')
			await provider.getBlockNumber() // Test connection
			const latency = Date.now() - startTime
			console.log(`✓ Connected to: ${rpc} (${latency}ms)`)

			return {
				provider,
				endpoint: rpc,
				latency,
				fallbacksAttempted,
			}
		} catch (error) {
			console.log(
				`✗ Failed to connect to ${rpc}: ${error instanceof Error ? error.message : String(error)}`,
			)
			fallbacksAttempted++
		}
	}

	throw new Error(
		`All RPC endpoints failed (attempted ${fallbacksAttempted})`,
	)
}

async function loadContracts(provider: ethers.JsonRpcProvider): Promise<Record<string, ethers.Contract>> {
	const abiPath = path.join(__dirname, '../contracts/augur-abis.json')
	const abiData = await fs.readFile(abiPath, 'utf8')
	const abis = JSON.parse(abiData)

	// Initialize contract instances with correct names
	const contracts = {
		universe: new ethers.Contract(
			abis.universe.address,
			abis.universe.abi,
			provider,
		),
		augur: new ethers.Contract(
			abis.augur.address,
			abis.augur.abi,
			provider,
		),
		repV2Token: new ethers.Contract(
			abis.repV2Token.address,
			abis.repV2Token.abi,
			provider,
		),
		cash: new ethers.Contract(
			abis.cash.address,
			abis.cash.abi,
			provider,
		),
	}

	console.log('✓ Loaded contracts:')
	console.log(`  Universe: ${abis.universe.address}`)
	console.log(`  Augur: ${abis.augur.address}`)
	console.log(`  REPv2: ${abis.repV2Token.address}`)
	console.log(`  Cash: ${abis.cash.address}`)

	return contracts
}

async function calculateForkRisk(): Promise<ForkRiskData> {
	try {
		console.log('Starting fork risk calculation...')

		// Get blockchain connection and contracts
		const connection = await getWorkingProvider()
		const contracts = await loadContracts(connection.provider)

		// Get current blockchain state
		const blockNumber = await connection.provider.getBlockNumber()
		console.log(`Block Number: ${blockNumber}`)
		const timestamp = new Date().toISOString()

		// Check if universe is already forking
		const isForking = await contracts.universe.isForking()
		if (isForking) {
			console.log('⚠️ UNIVERSE IS FORKING! Setting maximum risk level')
			return getForkingResult(timestamp, blockNumber, connection)
		}

		// Calculate key metrics
		const activeDisputes = await getActiveDisputes(connection.provider, contracts)
		const largestDisputeBond = getLargestDisputeBond(activeDisputes)

		// Calculate risk level
		const forkThresholdPercent =
			(largestDisputeBond / FORK_THRESHOLD_REP) * 100
		const riskLevel = determineRiskLevel(forkThresholdPercent)
		const riskPercentage = forkThresholdPercent

		// Prepare results
		const results: ForkRiskData = {
			timestamp,
			blockNumber,
			riskLevel,
			riskPercentage: Math.min(100, Math.max(0, riskPercentage)),
			metrics: {
				largestDisputeBond,
				forkThresholdPercent: Math.round(forkThresholdPercent * 100) / 100,
				activeDisputes: activeDisputes.length,
				disputeDetails: activeDisputes.slice(0, 5), // Top 5 disputes
			},
			nextUpdate: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
			rpcInfo: {
				endpoint: connection.endpoint,
				latency: connection.latency,
				fallbacksAttempted: connection.fallbacksAttempted,
			},
			calculation: {
				method: 'GitHub Actions + Public RPC',
				forkThreshold: FORK_THRESHOLD_REP,
			},
		}

		console.log('Calculation completed successfully')
		console.log(`Risk Level: ${riskLevel}`)
		console.log(`Largest Dispute Bond: ${largestDisputeBond} REP`)
		console.log(`Fork Threshold: ${forkThresholdPercent.toFixed(2)}%`)
		console.log(`RPC Used: ${connection.endpoint} (${connection.latency}ms)`)
		console.log(`Block Number: ${blockNumber}`)

		return results
	} catch (error) {
		console.error('Error calculating fork risk:', error)
		throw error // Don't return mock data - let the error bubble up
	}
}

async function getActiveDisputes(provider: ethers.JsonRpcProvider, contracts: Record<string, ethers.Contract>): Promise<DisputeDetails[]> {
	try {
		console.log('Querying DisputeCrowdsourcerCreated events...')

		// Query events in smaller chunks due to RPC block limit (1000 blocks max)
		const currentBlock = await provider.getBlockNumber()
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
					contracts.augur.filters.DisputeCrowdsourcerCreated()
				const chunkEvents = await contracts.augur.queryFilter(
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
					event.args.length < 6
				)
					continue

				const [
					_universe,
					marketAddress,
					_disputeCrowdsourcerAddress,
					_payoutNumerators,
					bondSizeWei,
					isInvalid,
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
						provider,
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
				} catch (_marketError) {
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

function getLargestDisputeBond(disputes: DisputeDetails[]): number {
	if (disputes.length === 0) return 0
	return Math.max(...disputes.map((d) => d.disputeBondSize))
}



function determineRiskLevel(forkThresholdPercent: number): RiskLevel {
	if (forkThresholdPercent > RISK_LEVELS.CRITICAL) return 'critical'
	if (forkThresholdPercent >= RISK_LEVELS.HIGH) return 'high'
	if (forkThresholdPercent >= RISK_LEVELS.MODERATE) return 'moderate'
	return 'low'
}

function getForkingResult(timestamp: string, blockNumber: number, connection: RpcConnection): ForkRiskData {
	return {
		timestamp,
		blockNumber,
		riskLevel: 'critical',
		riskPercentage: 100,
		metrics: {
			largestDisputeBond: FORK_THRESHOLD_REP, // Fork threshold was reached
			forkThresholdPercent: 100,
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
			endpoint: connection.endpoint,
			latency: connection.latency,
			fallbacksAttempted: connection.fallbacksAttempted,
		},
		calculation: {
			method: 'Fork Detected',
			forkThreshold: FORK_THRESHOLD_REP,
		},
	}
}

function getErrorResult(errorMessage: string): ForkRiskData {
	return {
		timestamp: new Date().toISOString(),
		riskLevel: 'unknown',
		riskPercentage: 0,
		error: errorMessage,
		metrics: {
			largestDisputeBond: 0,
			forkThresholdPercent: 0,
			activeDisputes: 0,
			disputeDetails: [],
		},
		nextUpdate: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
		rpcInfo: {
			endpoint: null,
			latency: null,
			fallbacksAttempted: 0,
		},
		calculation: {
			method: 'Error',
			forkThreshold: FORK_THRESHOLD_REP,
		},
	}
}

async function saveResults(results: ForkRiskData): Promise<void> {
	const outputPath = path.join(__dirname, '../public/data/fork-risk.json')

	// Ensure data directory exists
	await fs.mkdir(path.dirname(outputPath), { recursive: true })

	// Write results with pretty formatting
	await fs.writeFile(outputPath, JSON.stringify(results, null, 2))

	console.log(`Results saved to ${outputPath}`)
}

// Main execution
async function main(): Promise<void> {
	try {
		const results = await calculateForkRisk()
		await saveResults(results)

		console.log('\n✓ Fork risk calculation completed successfully')
		console.log(
			`Results saved using PUBLIC RPC: ${results.rpcInfo.endpoint}`,
		)
		process.exit(0)
	} catch (error) {
		console.error('\n✗ Fatal error during fork risk calculation:')
		console.error(
			`Error: ${error instanceof Error ? error.message : String(error)}`,
		)

		// Create an error result to save
		const errorResult: ForkRiskData = getErrorResult(
			error instanceof Error ? error.message : String(error)
		)

		try {
			await saveResults(errorResult)
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
