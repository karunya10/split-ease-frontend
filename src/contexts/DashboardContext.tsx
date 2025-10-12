"use client";

import React, { createContext, useContext, useState } from "react";

interface NewExpense {
  description: string;
  amount: string;
  splits: { userId: string; amountOwed: number }[];
}

interface DashboardContextType {
  selectedGroupId: string | null;
  setSelectedGroupId: (groupId: string | null) => void;

  // Dialog states
  showCreateGroupForm: boolean;
  setShowCreateGroupForm: (show: boolean) => void;
  showCreateExpenseForm: boolean;
  setShowCreateExpenseForm: (show: boolean) => void;
  showGroupMembers: boolean;
  setShowGroupMembers: (show: boolean) => void;
  showAddMember: boolean;
  setShowAddMember: (show: boolean) => void;
  showDeleteGroup: boolean;
  setShowDeleteGroup: (show: boolean) => void;

  // Form data states
  newGroupName: string;
  setNewGroupName: (name: string) => void;
  newExpense: NewExpense;
  setNewExpense: (expense: NewExpense) => void;

  // Helper methods
  resetNewGroupForm: () => void;
  resetNewExpenseForm: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Dialog states
  const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
  const [showCreateExpenseForm, setShowCreateExpenseForm] = useState(false);
  const [showGroupMembers, setShowGroupMembers] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showDeleteGroup, setShowDeleteGroup] = useState(false);

  // Form data states
  const [newGroupName, setNewGroupName] = useState("");
  const [newExpense, setNewExpense] = useState<NewExpense>({
    description: "",
    amount: "",
    splits: [],
  });

  // Helper methods
  const resetNewGroupForm = () => {
    setNewGroupName("");
  };

  const resetNewExpenseForm = () => {
    setNewExpense({
      description: "",
      amount: "",
      splits: [],
    });
  };

  return (
    <DashboardContext.Provider
      value={{
        selectedGroupId,
        setSelectedGroupId,
        showCreateGroupForm,
        setShowCreateGroupForm,
        showCreateExpenseForm,
        setShowCreateExpenseForm,
        showGroupMembers,
        setShowGroupMembers,
        showAddMember,
        setShowAddMember,
        showDeleteGroup,
        setShowDeleteGroup,
        newGroupName,
        setNewGroupName,
        newExpense,
        setNewExpense,
        resetNewGroupForm,
        resetNewExpenseForm,
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
