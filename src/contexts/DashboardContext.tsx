"use client";

import React, { createContext, useContext, useState } from "react";

interface DashboardContextType {
  selectedGroupId: string | null;
  setSelectedGroupId: (groupId: string | null) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  return (
    <DashboardContext.Provider
      value={{
        selectedGroupId,
        setSelectedGroupId,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
