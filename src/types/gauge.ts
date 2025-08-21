export interface GaugeData {
  percentage: number;
  repStaked: number;
  activeDisputes: number;
}

export interface RiskLevel {
  level: 'Low' | 'Medium' | 'High';
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