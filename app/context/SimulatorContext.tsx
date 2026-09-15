"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SimulatorConfig } from '../types/simulator';
import { useTheme } from '../hooks/useTheme';

interface SimulatorContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  config: SimulatorConfig;
  updateConfig: (newConfig: Partial<SimulatorConfig>) => void;
  selectedVehicleId: string | null;
  setSelectedVehicleId: (id: string | null) => void;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

/**
 * Clean & lightweight UI configuration context (No in-memory mock databases or tickers)
 */
export const SimulatorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [config, setConfig] = useState<SimulatorConfig>({
    intervalMs: 1000,
    targetApiUrl: 'http://localhost:8090',
    forwardHttp: false,
    heartbeatTimeoutSeconds: 10,
  });

  const updateConfig = (newConfig: Partial<SimulatorConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  return (
    <SimulatorContext.Provider
      value={{
        theme,
        toggleTheme,
        config,
        updateConfig,
        selectedVehicleId,
        setSelectedVehicleId,
      }}
    >
      {children}
    </SimulatorContext.Provider>
  );
};

export const useSimulator = () => {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error('useSimulator must be used within a SimulatorProvider');
  }
  return context;
};
