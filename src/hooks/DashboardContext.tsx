import React, { createContext, useContext, useState } from 'react';

interface DashboardContextType {
  digitalSkillsPercentages: number[];
  setDigitalSkillsPercentages: (percentages: number[]) => void;
}

const defaultPercentages: number[] = [];

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [digitalSkillsPercentages, setDigitalSkillsPercentages] = useState<number[]>(defaultPercentages);

  return (
    <DashboardContext.Provider value={{
      digitalSkillsPercentages,
      setDigitalSkillsPercentages
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};