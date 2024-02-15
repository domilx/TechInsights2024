import React, { createContext, useState, ReactNode } from 'react';
import { PitModel, initialPitData } from '../models/PitModel';

interface DataContextType {
  teams: PitModel[];
  setTeams: (teams: PitModel[]) => void;
  lastSync: string;
  setLastSync: (lastSync: string) => void;
  selectedTeam: PitModel | undefined;
  setSelectedTeam: (selectedTeam: PitModel | undefined) => void;
}

export const DataContext = createContext<DataContextType>({
  teams: [],
  setTeams: () => {},
  lastSync: '',
  setLastSync: () => {},
  selectedTeam: undefined,
  setSelectedTeam: () => {},
});

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [teams, setTeams] = useState<PitModel[]>([]);
  const [lastSync, setLastSync] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<PitModel | undefined>(undefined);

  return (
    <DataContext.Provider value={{ teams, setTeams, lastSync, setLastSync, selectedTeam, setSelectedTeam }}>
      {children}
    </DataContext.Provider>
  );
};