import React, { createContext, useContext, useState } from 'react';

type ViewMode = 'own' | 'partner';

interface ViewContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isPartnerConnected: boolean;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>('own');
  
  // Check if partner is connected from user data
  const isPartnerConnected = localStorage.getItem('finapp-partner-code') !== null;

  return (
    <ViewContext.Provider value={{ viewMode, setViewMode, isPartnerConnected }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error('useView must be used within ViewProvider');
  }
  return context;
}
