import React, { useState, useCallback } from 'react';
import { GaugeDisplay } from './GaugeDisplay';
import { DataPanels } from './DataPanels';
import { FloatingControls } from './FloatingControls';
import type { GaugeData, RiskLevel, FakeDataScenario } from '../types/gauge';

export const ForkMeter: React.FC = () => {
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [gaugeData, setGaugeData] = useState<GaugeData>({
    percentage: 0,
    repStaked: 0,
    activeDisputes: 0,
    totalRep: 11000000
  });
  const [isPanelExpanded, setIsPanelExpanded] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Never');

  const generateFakeData = useCallback((): GaugeData => {
    // Simulate realistic fork probability scenarios
    const scenarios: FakeDataScenario[] = [
      // Low risk scenario
      { 
        percentage: Math.random() * 25,
        repStaked: Math.floor(Math.random() * 50000) + 10000,
        activeDisputes: Math.floor(Math.random() * 3) + 1
      },
      // Medium risk scenario
      { 
        percentage: 30 + Math.random() * 35,
        repStaked: Math.floor(Math.random() * 150000) + 75000,
        activeDisputes: Math.floor(Math.random() * 8) + 3
      },
      // High risk scenario
      { 
        percentage: 70 + Math.random() * 30,
        repStaked: Math.floor(Math.random() * 300000) + 200000,
        activeDisputes: Math.floor(Math.random() * 15) + 8
      }
    ];
    
    // Weighted selection favoring lower risk scenarios
    const weights = [0.6, 0.3, 0.1];
    const random = Math.random();
    let selectedScenario: FakeDataScenario;
    
    if (random < weights[0]) {
      selectedScenario = scenarios[0];
    } else if (random < weights[0] + weights[1]) {
      selectedScenario = scenarios[1];
    } else {
      selectedScenario = scenarios[2];
    }
    
    return {
      percentage: selectedScenario.percentage,
      repStaked: selectedScenario.repStaked,
      activeDisputes: selectedScenario.activeDisputes,
      totalRep: 11000000
    };
  }, []);

  const updateDataForPercentage = useCallback((percentage: number): GaugeData => {
    // Generate corresponding data based on percentage
    let repStaked: number;
    let activeDisputes: number;
    
    if (percentage < 30) {
      repStaked = Math.floor(percentage * 2000) + 10000;
      activeDisputes = Math.floor(percentage / 10) + 1;
    } else if (percentage < 70) {
      repStaked = Math.floor(percentage * 2500) + 50000;
      activeDisputes = Math.floor(percentage / 8) + 2;
    } else {
      repStaked = Math.floor(percentage * 3000) + 100000;
      activeDisputes = Math.floor(percentage / 5) + 5;
    }
    
    return {
      percentage,
      repStaked,
      activeDisputes,
      totalRep: 11000000
    };
  }, []);

  const getRiskLevel = useCallback((percentage: number): RiskLevel => {
    if (percentage < 30) {
      return { level: 'Low' };
    } else if (percentage < 70) {
      return { level: 'Medium' };
    } else {
      return { level: 'High' };
    }
  }, []);

  const handleSliderChange = useCallback((percentage: number) => {
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    setCurrentValue(clampedPercentage);
    const newData = updateDataForPercentage(clampedPercentage);
    setGaugeData(newData);
    setLastUpdated(new Date().toLocaleTimeString());
  }, [updateDataForPercentage]);

  const handleRandomClick = useCallback(() => {
    const newData = generateFakeData();
    setCurrentValue(newData.percentage);
    setGaugeData(newData);
    setLastUpdated(new Date().toLocaleTimeString());
  }, [generateFakeData]);

  const handleTogglePanel = useCallback(() => {
    setIsPanelExpanded(prev => !prev);
  }, []);

  const riskLevel = getRiskLevel(gaugeData.percentage);

  return (
    <div className="max-w-4xl w-full text-center">
      <h1 className="text-5xl mb-4 font-light tracking-[0.1em] text-white">AUGUR FORK METER</h1>
      <p className="text-lg mb-10 font-light tracking-[0.08em] uppercase text-primary">Real-time monitoring of fork probability</p>
      
      <GaugeDisplay percentage={gaugeData.percentage} />
      
      <DataPanels 
        riskLevel={riskLevel}
        repStaked={gaugeData.repStaked}
        activeDisputes={gaugeData.activeDisputes}
        totalRep={gaugeData.totalRep}
        lastUpdated={lastUpdated}
      />
      
      <div className="mt-8 text-sm font-light tracking-[0.05em] uppercase text-primary">
        Last updated: <span className="text-white">{lastUpdated}</span>
      </div>
      
      <FloatingControls 
        percentage={currentValue}
        onSliderChange={handleSliderChange}
        onRandomClick={handleRandomClick}
        isPanelExpanded={isPanelExpanded}
        onTogglePanel={handleTogglePanel}
      />
    </div>
  );
};