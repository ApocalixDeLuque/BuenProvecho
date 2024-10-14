// ui/ContextLayout.tsx

'use client';
import React from 'react';
import { DataProvider } from './DataContext';

interface ContextLayoutProps {
  children: React.ReactNode;
}

const ContextLayout: React.FC<ContextLayoutProps> = ({ children }) => {
  return <DataProvider>{children}</DataProvider>;
};

export default ContextLayout;
