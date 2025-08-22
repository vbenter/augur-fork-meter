import React from 'react';
import { ForkRiskProvider } from '../contexts/ForkRiskContext';
import { ForkMeter } from './ForkMeter';

export const App: React.FC = () => {
  return (
    <ForkRiskProvider>
      <ForkMeter />
    </ForkRiskProvider>
  );
};