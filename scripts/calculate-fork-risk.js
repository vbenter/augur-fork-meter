#!/usr/bin/env node

/**
 * Augur Fork Risk Calculator
 * 
 * This script calculates the current risk of an Augur fork based on:
 * - Active dispute bonds and their sizes
 * - REP market cap vs open interest ratio
 * - Dispute escalation patterns
 * 
 * Results are saved to data/fork-risk.json for the UI to consume.
 * All calculations are transparent and auditable.
 */

import { ethers } from 'ethers';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const FORK_THRESHOLD_REP = 275000; // 2.5% of 11 million REP
const MINIMUM_SECURITY_MULTIPLIER = 3;
const TARGET_SECURITY_MULTIPLIER = 5;

// Risk level thresholds (percentage of fork threshold)
const RISK_LEVELS = {
  LOW: 0.5,      // <0.5% of fork threshold
  MODERATE: 2.0, // 0.5-2% of threshold
  HIGH: 5.0,     // 2-5% of threshold
  CRITICAL: 10.0 // >5% of threshold (anything over 10% is imminent)
};

class AugurForkCalculator {
  constructor() {
    this.provider = null;
    this.contracts = {};
  }

  async initialize() {
    // For demo purposes, use mock data if no RPC URL is provided
    const rpcUrl = process.env.ETH_RPC_URL;
    
    if (rpcUrl && rpcUrl !== 'https://mainnet.infura.io/v3/YOUR-PROJECT-ID') {
      // Initialize real Ethereum provider
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      await this.loadContracts();
    } else {
      // Use mock data for development/testing
      console.log('No valid RPC URL provided, using mock data for testing');
      this.createMockContracts();
    }
  }

  async loadContracts() {
    try {
      const abiPath = path.join(__dirname, '../contracts/augur-abis.json');
      const abiData = await fs.readFile(abiPath, 'utf8');
      const abis = JSON.parse(abiData);
      
      // Initialize contract instances
      this.contracts = {
        universe: new ethers.Contract(abis.universe.address, abis.universe.abi, this.provider),
        repToken: new ethers.Contract(abis.repToken.address, abis.repToken.abi, this.provider)
      };
    } catch (error) {
      console.error('Error loading contracts:', error);
      // For now, we'll create mock contracts for testing
      this.createMockContracts();
    }
  }

  createMockContracts() {
    // Mock contracts for development/testing
    console.log('Using mock contracts for testing');
    this.contracts = {
      universe: {
        async getOpenInterest() { return ethers.parseEther('1000000'); }, // 1M DAI
        async getCurrentDisputeWindow() { return '0x123...'; },
        async getDisputeRoundDurationInSeconds() { return 604800; } // 7 days
      },
      repToken: {
        async totalSupply() { return ethers.parseEther('11000000'); } // 11M REP
      }
    };
  }

  async calculateForkRisk() {
    try {
      console.log('Starting fork risk calculation...');
      
      // Get current blockchain state
      const blockNumber = this.provider ? await this.provider.getBlockNumber() : 12345678;
      const timestamp = new Date().toISOString();
      
      // Calculate key metrics
      const activeDisputes = await this.getActiveDisputes();
      const largestDisputeBond = this.getLargestDisputeBond(activeDisputes);
      const repMarketCap = await this.getRepMarketCap();
      const openInterest = await this.getOpenInterest();
      const securityRatio = this.calculateSecurityRatio(repMarketCap, openInterest);
      
      // Calculate risk level
      const forkThresholdPercent = (largestDisputeBond / FORK_THRESHOLD_REP) * 100;
      const riskLevel = this.determineRiskLevel(forkThresholdPercent, securityRatio);
      const riskPercentage = this.calculateRiskPercentage(forkThresholdPercent, securityRatio);
      
      // Prepare results
      const results = {
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
          disputeDetails: activeDisputes.slice(0, 5) // Top 5 disputes
        },
        nextUpdate: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
        calculation: {
          method: 'GitHub Actions + Static JSON',
          forkThreshold: FORK_THRESHOLD_REP,
          securityMultiplier: {
            current: securityRatio,
            minimum: MINIMUM_SECURITY_MULTIPLIER,
            target: TARGET_SECURITY_MULTIPLIER
          }
        }
      };
      
      console.log('Calculation completed successfully');
      console.log(`Risk Level: ${riskLevel}`);
      console.log(`Largest Dispute Bond: ${largestDisputeBond} REP`);
      console.log(`Fork Threshold: ${forkThresholdPercent.toFixed(2)}%`);
      
      return results;
      
    } catch (error) {
      console.error('Error calculating fork risk:', error);
      return this.getErrorResult(error.message);
    }
  }

  async getActiveDisputes() {
    // Mock implementation - in production this would query actual dispute events
    const mockDisputes = [
      {
        marketId: '0xabc123...',
        title: 'Will Bitcoin reach $100k by end of 2024?',
        disputeBondSize: 1500,
        disputeRound: 2,
        daysRemaining: 4
      },
      {
        marketId: '0xdef456...',
        title: 'US Presidential Election 2024 Winner',
        disputeBondSize: 850,
        disputeRound: 1,
        daysRemaining: 6
      }
    ];
    
    return mockDisputes;
  }

  getLargestDisputeBond(disputes) {
    if (disputes.length === 0) return 0;
    return Math.max(...disputes.map(d => d.disputeBondSize));
  }

  async getRepMarketCap() {
    // Mock implementation - in production would get from price oracle
    const repPrice = 15; // $15 per REP (mock)
    const totalSupply = 11000000; // 11M REP
    return repPrice * totalSupply; // $165M market cap
  }

  async getOpenInterest() {
    // Mock implementation - would query actual open interest
    return 50000000; // $50M open interest (mock)
  }

  calculateSecurityRatio(marketCap, openInterest) {
    return marketCap / openInterest;
  }

  determineRiskLevel(forkThresholdPercent, securityRatio) {
    // Adjust risk based on security ratio
    let adjustedThresholdPercent = forkThresholdPercent;
    
    // If security ratio is below minimum, increase perceived risk
    if (securityRatio < MINIMUM_SECURITY_MULTIPLIER) {
      adjustedThresholdPercent *= (MINIMUM_SECURITY_MULTIPLIER / securityRatio);
    }
    
    if (adjustedThresholdPercent >= RISK_LEVELS.CRITICAL) return 'critical';
    if (adjustedThresholdPercent >= RISK_LEVELS.HIGH) return 'high';
    if (adjustedThresholdPercent >= RISK_LEVELS.MODERATE) return 'moderate';
    return 'low';
  }

  calculateRiskPercentage(forkThresholdPercent, securityRatio) {
    // Base risk from dispute bond size (0-50%)
    const baseRisk = Math.min(50, (forkThresholdPercent / 10) * 50);
    
    // Additional risk from poor security ratio (0-50%)
    let securityRisk = 0;
    if (securityRatio < TARGET_SECURITY_MULTIPLIER) {
      securityRisk = Math.max(0, (TARGET_SECURITY_MULTIPLIER - securityRatio) / TARGET_SECURITY_MULTIPLIER * 50);
    }
    
    return Math.round(baseRisk + securityRisk);
  }

  getErrorResult(errorMessage) {
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
        disputeDetails: []
      },
      nextUpdate: new Date(Date.now() + 60 * 60 * 1000).toISOString()
    };
  }

  async saveResults(results) {
    const outputPath = path.join(__dirname, '../data/fork-risk.json');
    
    // Ensure data directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    
    // Write results with pretty formatting
    await fs.writeFile(outputPath, JSON.stringify(results, null, 2));
    
    console.log(`Results saved to ${outputPath}`);
  }
}

// Main execution
async function main() {
  const calculator = new AugurForkCalculator();
  
  try {
    await calculator.initialize();
    const results = await calculator.calculateForkRisk();
    await calculator.saveResults(results);
    
    console.log('Fork risk calculation completed successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}