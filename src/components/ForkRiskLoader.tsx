import React, { useState, useEffect, useCallback } from 'react';
import type { ForkRiskData, GaugeData, RiskLevel } from '../types/gauge';

interface ForkRiskLoaderProps {
  children: (data: {
    gaugeData: GaugeData;
    riskLevel: RiskLevel;
    lastUpdated: string;
    isLoading: boolean;
    error?: string;
    rawData?: ForkRiskData;
  }) => React.ReactNode;
}

export const ForkRiskLoader: React.FC<ForkRiskLoaderProps> = ({ children }) => {
  const [forkRiskData, setForkRiskData] = useState<ForkRiskData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  const loadForkRiskData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(undefined);

      // Try to load from static JSON file first
      const response = await fetch('/data/fork-risk.json');
      
      if (!response.ok) {
        throw new Error(`Failed to load fork risk data: ${response.status}`);
      }

      const data: ForkRiskData = await response.json();
      setForkRiskData(data);

    } catch (err) {
      console.error('Error loading fork risk data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
      
      // Fallback to mock data if file doesn't exist
      setForkRiskData(getDefaultData());
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data on mount and set up refresh interval
  useEffect(() => {
    loadForkRiskData();

    // Refresh every 5 minutes (data updates hourly, so this is reasonable)
    const interval = setInterval(loadForkRiskData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadForkRiskData]);

  const getDefaultData = (): ForkRiskData => ({
    timestamp: new Date().toISOString(),
    blockNumber: 0,
    riskLevel: 'unknown',
    riskPercentage: 0,
    metrics: {
      largestDisputeBond: 0,
      forkThresholdPercent: 0,
      repMarketCap: 165000000,
      openInterest: 50000000,
      securityRatio: 3.3,
      activeDisputes: 0,
      disputeDetails: []
    },
    nextUpdate: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    calculation: {
      method: 'Static fallback',
      forkThreshold: 275000,
      securityMultiplier: {
        current: 3.3,
        minimum: 3,
        target: 5
      }
    }
  });

  const convertToGaugeData = (data: ForkRiskData): GaugeData => ({
    percentage: data.riskPercentage,
    repStaked: data.metrics.largestDisputeBond,
    activeDisputes: data.metrics.activeDisputes
  });

  const convertToRiskLevel = (data: ForkRiskData): RiskLevel => {
    let level: RiskLevel['level'];
    
    switch (data.riskLevel) {
      case 'low':
        level = 'Low';
        break;
      case 'moderate':
        level = 'Medium';
        break;
      case 'high':
        level = 'High';
        break;
      case 'critical':
        level = 'Critical';
        break;
      default:
        level = 'Low';
    }

    return { level };
  };

  const formatLastUpdated = (data: ForkRiskData): string => {
    try {
      return new Date(data.timestamp).toLocaleString();
    } catch {
      return 'Unknown';
    }
  };

  const currentData = forkRiskData || getDefaultData();

  return (
    <>
      {children({
        gaugeData: convertToGaugeData(currentData),
        riskLevel: convertToRiskLevel(currentData),
        lastUpdated: formatLastUpdated(currentData),
        isLoading,
        error: error || currentData.error,
        rawData: currentData
      })}
    </>
  );
};