'use client';
import React, { useState } from 'react';
import DataContext from './DataContext';
import { FoodItem } from '@/app/ui/FoodList';

interface ContextLayoutProps {
  children: React.ReactNode;
}

const ContextLayout: React.FC<ContextLayoutProps> = ({ children }) => {
  const [scannedGroup, setScannedGroup] = useState<FoodItem[]>([]);
  return <DataContext.Provider value={{ scannedGroup, setScannedGroup }}>{children}</DataContext.Provider>;
};

export default ContextLayout;
