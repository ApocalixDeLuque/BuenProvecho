import { FoodItem } from './FoodList';
import { createContext } from 'react';

type DataContextType = {
  scannedGroup: FoodItem[];
  setScannedGroup: React.Dispatch<React.SetStateAction<FoodItem[]>>;
};

// Crear un objeto inicial
const initialData: DataContextType = {
  scannedGroup: [],
  setScannedGroup: () => {}, // función vacía por defecto
};

// Pasar el objeto inicial al crear el Contexto
const DataContext = createContext<DataContextType>(initialData);

export default DataContext;
