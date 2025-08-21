export interface GaugeData {
  percentage: number;
  repStaked: number;
  activeDisputes: number;
}

export interface RiskLevel {
  level: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface ForkRiskData {
  timestamp: string;
  blockNumber: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical' | 'unknown';
  riskPercentage: number;
  metrics: {
    largestDisputeBond: number;
    forkThresholdPercent: number;
    repMarketCap: number;
    openInterest: number;
    securityRatio: number;
    activeDisputes: number;
    disputeDetails: Array<{
      marketId: string;
      title: string;
      disputeBondSize: number;
      disputeRound: number;
      daysRemaining: number;
    }>;
  };
  nextUpdate: string;
  calculation: {
    method: string;
    forkThreshold: number;
    securityMultiplier: {
      current: number;
      minimum: number;
      target: number;
    };
  };
  error?: string;
}

export interface GaugeDisplayProps {
  percentage: number;
  onPercentageChange?: (percentage: number) => void;
}

export interface DataPanelsProps {
  riskLevel: RiskLevel;
  repStaked: number;
  activeDisputes: number;
}

export interface FloatingControlsProps {
  percentage: number;
  onSliderChange: (percentage: number) => void;
  onLowRiskClick: () => void;
  onMediumRiskClick: () => void;
  onHighRiskClick: () => void;
  isPanelExpanded: boolean;
  onTogglePanel: () => void;
}

export interface FakeDataScenario {
  percentage: number;
  repStaked: number;
  activeDisputes: number;
}