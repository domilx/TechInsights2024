import React, { createContext, useState, ReactNode } from 'react';
import { PitModel } from '../models/PitModel';

interface DataContextType {
  teams: PitModel[];
  setTeams: (teams: PitModel[]) => void;
  lastSync: string;
  setLastSync: (lastSync: string) => void;
}

export const DataContext = createContext<DataContextType>({
  teams: [],
  setTeams: () => {},
  lastSync: '',
  setLastSync: () => {},
});

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [teams, setTeams] = useState<PitModel[]>([]);
  const [lastSync, setLastSync] = useState<string>('');

  return (
    <DataContext.Provider value={{ teams, setTeams, lastSync, setLastSync }}>
      {children}
    </DataContext.Provider>
  );
};
