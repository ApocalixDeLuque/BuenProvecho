'use client';

import { ScannedCollection, FoodItem } from '@/utils/types';
import React, { createContext, useState, useEffect, useCallback } from 'react';

type DataContextType = {
  scannedCollections: ScannedCollection[];
  setScannedCollections: React.Dispatch<React.SetStateAction<ScannedCollection[]>>;
  allFoodItems: FoodItem[];
  setAllFoodItems: React.Dispatch<React.SetStateAction<FoodItem[]>>;
  loadScannedCollections: () => Promise<void>;
  loadAllFoodItems: () => Promise<void>;
};

export const DataContext = createContext<DataContextType>({
  scannedCollections: [],
  setScannedCollections: () => {},
  allFoodItems: [],
  setAllFoodItems: () => {},
  loadScannedCollections: async () => {},
  loadAllFoodItems: async () => {},
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scannedCollections, setScannedCollections] = useState<ScannedCollection[]>([]);
  const [allFoodItems, setAllFoodItems] = useState<FoodItem[]>([]);

  const loadScannedCollections = useCallback(async () => {
    try {
      const response = await fetch('/api/getAlacena');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Scanned collections loaded:', data);
      setScannedCollections(data);
    } catch (error) {
      console.error('Error fetching scanned collections:', error);
    }
  }, []);

  const loadAllFoodItems = useCallback(async () => {
    try {
      const response = await fetch('/api/getAllFoodItems');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('All food items loaded:', data);
      setAllFoodItems(data);
    } catch (error) {
      console.error('Error fetching all food items:', error);
    }
  }, []);

  useEffect(() => {
    loadScannedCollections();
    loadAllFoodItems();
  }, [loadScannedCollections, loadAllFoodItems]);

  return (
    <DataContext.Provider
      value={{
        scannedCollections,
        setScannedCollections,
        allFoodItems,
        setAllFoodItems,
        loadScannedCollections,
        loadAllFoodItems,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
