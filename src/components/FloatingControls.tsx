import React from 'react';
import type { FloatingControlsProps } from '../types/gauge';

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  percentage,
  onSliderChange,
  onRandomClick,
  isPanelExpanded,
  onTogglePanel
}) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    onSliderChange(value);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[1000]">
      <div className={`bg-gray-900/95 rounded-xl p-5 backdrop-blur border border-primary/30 flex flex-col gap-4 min-w-[250px] transition-transform duration-300 ease-in-out ${
        isPanelExpanded ? 'translate-x-0' : 'translate-x-[calc(100%+20px)]'
      }`}>
        <div className="flex items-center gap-2.5">
          <label htmlFor="percentageSlider" className="text-sm min-w-[60px] font-light tracking-[0.1em] uppercase text-primary">MANUAL:</label>
          <input 
            type="range" 
            id="percentageSlider" 
            min="0" 
            max="100" 
            value={percentage} 
            step="0.1"
            onChange={handleSliderChange}
            className="flex-1 h-1.5 rounded-sm bg-white/20 outline-none appearance-none slider"
          />
        </div>
        <div className="flex items-center gap-2.5">
          <button 
            onClick={onRandomClick}
            className="px-4 py-2 text-white border border-primary/50 bg-primary/10 rounded-md cursor-pointer text-sm font-light tracking-[0.1em] uppercase transition-all duration-300 whitespace-nowrap hover:bg-primary/20 hover:border-primary"
          >
            Random
          </button>
        </div>
        <div 
          className="absolute -left-10 top-1/2 -translate-y-1/2 w-10 h-15 bg-gray-900/95 border border-primary/30 border-r-0 rounded-l-lg text-primary cursor-pointer flex items-center justify-center text-lg transition-colors duration-300 hover:bg-gray-800/95 hover:text-primary"
          onClick={onTogglePanel}
        >
          ⚙
        </div>
      </div>
    </div>
  );
};