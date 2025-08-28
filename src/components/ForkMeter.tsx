import React from 'react'
import { GaugeDisplay } from './GaugeDisplay'
import { DataPanels } from './DataPanels'
import { useForkRisk } from '../contexts/ForkRiskContext'

export const ForkMeter = () => {
	// Use the fork risk hook to get data
	const {
		gaugeData,
		riskLevel,
		lastUpdated,
		isLoading,
		error,
	} = useForkRisk()

	return (
		<div className="max-w-4xl w-full text-center">
<<<<<<< HEAD
			<h1 className="text-5xl mb-2 font-light tracking-[0.1em] text-primary">
				AUGUR FORK METER
			</h1>
			<p className="text-lg mb-10 font-light tracking-[0.08em] uppercase text-muted-primary">
				Real-time monitoring of fork probability
			</p>
||||||| e90b0aa
  const generateLowRiskData = useCallback((): GaugeData => {
    const percentage = Math.random() * 25;
    const repStaked = Math.floor(Math.random() * 50000) + 10000;
    const activeDisputes = Math.floor(Math.random() * 3) + 1;
    
    return { percentage, repStaked, activeDisputes };
  }, []);
=======
			{isLoading && <div className="mb-4 text-muted-primary">Loading fork risk data...</div>}
>>>>>>> fork-meter-simplified

<<<<<<< HEAD
			{isLoading && (
				<div className="mb-4 text-muted-primary">Loading fork risk data...</div>
			)}
||||||| e90b0aa
  const generateMediumRiskData = useCallback((): GaugeData => {
    const percentage = 30 + Math.random() * 35;
    const repStaked = Math.floor(Math.random() * 150000) + 75000;
    const activeDisputes = Math.floor(Math.random() * 8) + 3;
    
    return { percentage, repStaked, activeDisputes };
  }, []);
=======
			{error && <div className="mb-4 text-orange-400">Warning: {error}</div>}
>>>>>>> fork-meter-simplified

<<<<<<< HEAD
			{error && (
				<div className="mb-4 text-orange-400">Warning: {error}</div>
			)}
||||||| e90b0aa
  const generateHighRiskData = useCallback((): GaugeData => {
    const percentage = 70 + Math.random() * 30;
    const repStaked = Math.floor(Math.random() * 300000) + 200000;
    const activeDisputes = Math.floor(Math.random() * 15) + 8;
    
    return { percentage, repStaked, activeDisputes };
  }, []);
=======
			<GaugeDisplay percentage={gaugeData.percentage} />
>>>>>>> fork-meter-simplified

<<<<<<< HEAD
			<GaugeDisplay percentage={gaugeData.percentage} />
||||||| e90b0aa
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
      activeDisputes
    };
  }, []);
=======
			<DataPanels
				riskLevel={riskLevel}
				repStaked={gaugeData.repStaked}
				activeDisputes={gaugeData.activeDisputes}
			/>
>>>>>>> fork-meter-simplified

<<<<<<< HEAD
			<DataPanels
				riskLevel={riskLevel}
				repStaked={gaugeData.repStaked}
				activeDisputes={gaugeData.activeDisputes}
			/>

			<div className="mt-8 text-sm font-light tracking-[0.05em] uppercase text-muted-primary">
||||||| e90b0aa
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
    setLastUpdated(new Date().toLocaleString());
  }, [updateDataForPercentage]);

  const handleLowRiskClick = useCallback(() => {
    const newData = generateLowRiskData();
    setCurrentValue(newData.percentage);
    setGaugeData(newData);
    setLastUpdated(new Date().toLocaleString());
  }, [generateLowRiskData]);

  const handleMediumRiskClick = useCallback(() => {
    const newData = generateMediumRiskData();
    setCurrentValue(newData.percentage);
    setGaugeData(newData);
    setLastUpdated(new Date().toLocaleString());
  }, [generateMediumRiskData]);

  const handleHighRiskClick = useCallback(() => {
    const newData = generateHighRiskData();
    setCurrentValue(newData.percentage);
    setGaugeData(newData);
    setLastUpdated(new Date().toLocaleString());
  }, [generateHighRiskData]);

  const handleTogglePanel = useCallback(() => {
    setIsPanelExpanded(prev => !prev);
  }, []);

  const riskLevel = getRiskLevel(gaugeData.percentage);

  return (
    <div className={cn("max-w-4xl w-full text-center")}>
      <h1 className="text-5xl mb-2 font-light tracking-[0.1em] text-primary">AUGUR FORK METER</h1>
      <p className="text-lg mb-10 font-light tracking-[0.08em] uppercase text-muted-primary">Real-time monitoring of fork probability</p>
      
      <GaugeDisplay percentage={gaugeData.percentage} />
      
      <DataPanels 
        riskLevel={riskLevel}
        repStaked={gaugeData.repStaked}
        activeDisputes={gaugeData.activeDisputes}
      />
      
      <div className="mt-8 text-sm font-light tracking-[0.05em] uppercase text-muted-primary">
        Last updated: <span className="text-primary">{lastUpdated}</span>
      </div>
      
      <FloatingControls 
        percentage={currentValue}
        onSliderChange={handleSliderChange}
        onLowRiskClick={handleLowRiskClick}
        onMediumRiskClick={handleMediumRiskClick}
        onHighRiskClick={handleHighRiskClick}
        isPanelExpanded={isPanelExpanded}
        onTogglePanel={handleTogglePanel}
      />
    </div>
  );
};
=======
			<div className="text-sm font-light tracking-[0.05em] uppercase text-muted-primary">
>>>>>>> fork-meter-simplified
				Last updated: <span className="text-primary">{lastUpdated}</span>
			</div>
		</div>
	)
}
