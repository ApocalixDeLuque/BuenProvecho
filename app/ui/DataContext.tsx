import { createContext, useState, useEffect } from 'react';
import { FoodItem } from './FoodList';

type DataContextType = {
  scannedGroup: FoodItem[];
  setScannedGroup: React.Dispatch<React.SetStateAction<FoodItem[]>>;
  loadScannedGroup: () => Promise<void>;
};

const initialData: DataContextType = {
  scannedGroup: [],
  setScannedGroup: () => {},
  loadScannedGroup: async () => {},
};

const DataContext = createContext<DataContextType>(initialData);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scannedGroup, setScannedGroup] = useState<FoodItem[]>([]);

  const loadScannedGroup = async () => {
    try {
      const response = await fetch('/api/get');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Datos cargados:', data); // Verifica los datos
      setScannedGroup(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    loadScannedGroup(); // Load data on mount
  }, []); // Dependencias vacías para que se ejecute solo una vez

  return (
    <DataContext.Provider value={{ scannedGroup, setScannedGroup, loadScannedGroup }}>{children}</DataContext.Provider>
  );
};

export default DataContext;
