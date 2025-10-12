"use client";

import { Button } from "@/components/ui/button";
import { Plus, Users, Loader2 } from "lucide-react";
import { Group, SettlementSummary } from "@/types/dashboard";
import {
  getGroupAvatar,
  getBalanceColor,
  formatCurrency,
} from "@/lib/dashboardUtils";

interface DashboardSidebarProps {
  groups: Group[];
  selectedGroupId: string | null;
  onGroupSelect: (groupId: string) => void;
  onCreateGroup: () => void;
  onCreateExpense: () => void;
  settlementSummary?: SettlementSummary;
  isCreatingGroup: boolean;
  hasSelectedGroup: boolean;
}

export default function DashboardSidebar({
  groups,
  selectedGroupId,
  onGroupSelect,
  onCreateGroup,
  onCreateExpense,
  settlementSummary,
  isCreatingGroup,
  hasSelectedGroup,
}: DashboardSidebarProps) {
  return (
    <div className="w-80 bg-gray-800 border-r border-gray-700 p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-300">Your groups</h2>
          {groups.length === 0 && (
            <Button
              size="sm"
              onClick={onCreateGroup}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>

        {groups.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400 mb-4">No groups yet</p>
            <Button
              onClick={onCreateGroup}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create your first group
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map((group) => {
              const netBalance = settlementSummary?.netBalance || 0;
              return (
                <div
                  key={group.id}
                  onClick={() => onGroupSelect(group.id)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedGroupId === group.id
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-lg">
                      {getGroupAvatar(group.name)}
                    </div>
                    <div>
                      <span className="font-medium block">{group.name}</span>
                      <span className="text-xs text-gray-400">
                        {group.members.length} members • {group._count.expenses}{" "}
                        expenses
                      </span>
                    </div>
                  </div>
                  {selectedGroupId === group.id && (
                    <span
                      className={`font-semibold text-sm ${getBalanceColor(
                        netBalance
                      )}`}
                    >
                      {Math.abs(netBalance) > 0
                        ? formatCurrency(Math.abs(netBalance))
                        : "$0"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {groups.length > 0 && (
          <Button
            onClick={onCreateGroup}
            className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white"
            disabled={isCreatingGroup}
          >
            {isCreatingGroup ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            New Group
          </Button>
        )}
      </div>

   
    </div>
  );
}