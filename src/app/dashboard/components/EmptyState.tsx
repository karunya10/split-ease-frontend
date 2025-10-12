"use client";

import { Users } from "lucide-react";

interface EmptyStateProps {
  hasGroups: boolean;
}

export default function EmptyState({ hasGroups }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <Users className="w-16 h-16 mx-auto text-gray-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-300 mb-2">
          {hasGroups ? "Select a group" : "Create your first group"}
        </h2>
        <p className="text-gray-400">
          {hasGroups
            ? "Choose a group from the sidebar to view expenses"
            : "Start splitting expenses with friends and family"}
        </p>
      </div>
    </div>
  );
}