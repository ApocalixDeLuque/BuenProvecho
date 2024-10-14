'use client';

import { FoodItem } from '@/utils/types';
import React, { createContext, useState, useEffect, useCallback } from 'react';

type DataContextType = {
  scannedGroup: FoodItem[];
  setScannedGroup: React.Dispatch<React.SetStateAction<FoodItem[]>>;
  loadScannedGroup: () => Promise<void>;
};

export const DataContext = createContext<DataContextType>({
  scannedGroup: [],
  setScannedGroup: () => {},
  loadScannedGroup: async () => {},
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scannedGroup, setScannedGroup] = useState<FoodItem[]>([]);

  const loadScannedGroup = useCallback(async () => {
    try {
      const response = await fetch('/api/getAlacena');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Datos cargados:', data);
      setScannedGroup(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    loadScannedGroup();
  }, [loadScannedGroup]);

  return (
    <DataContext.Provider value={{ scannedGroup, setScannedGroup, loadScannedGroup }}>{children}</DataContext.Provider>
  );
};
