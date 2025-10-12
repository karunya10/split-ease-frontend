"use client";

import { Button } from "@/components/ui/button";
import { Plus, Users, Trash2 } from "lucide-react";
import { GroupDetail, SettlementSummary } from "@/types/dashboard";
import {
  getGroupAvatar,
  getBalanceColor,
  formatCurrency,
  formatDate,
} from "@/lib/dashboardUtils";

interface GroupHeaderProps {
  group: GroupDetail;
  settlementSummary?: SettlementSummary;
  onAddExpense: () => void;
  onViewMembers: () => void;
  onDeleteGroup: () => void;
  currentUserRole: string;
}

export default function GroupHeader({
  group,
  settlementSummary,
  onAddExpense,
  onViewMembers,
  onDeleteGroup,
  currentUserRole,
}: GroupHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-2xl">
          {getGroupAvatar(group.name)}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{group.name}</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={onViewMembers}
              className="text-gray-400 hover:text-teal-400 transition-colors"
            >
              {group.members.length} members
            </button>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400">
              Created {formatDate(group.createdAt)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {settlementSummary && (
          <div className="text-right">
            <p className="text-gray-400 text-sm">
              {settlementSummary.netBalance >= 0 ? "You are owed" : "You owe"}
            </p>
            <p
              className={`text-2xl font-bold ${getBalanceColor(
                settlementSummary.netBalance
              )}`}
            >
              {formatCurrency(Math.abs(settlementSummary.netBalance))}
            </p>
          </div>
        )}
        <div className="flex gap-2">
          <Button
            onClick={onViewMembers}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Users className="w-4 h-4 mr-2" />
            Members
          </Button>
          <Button
            onClick={onAddExpense}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add expense
          </Button>
          {(currentUserRole === "admin" || currentUserRole === "owner") && (
            <Button
              onClick={onDeleteGroup}
              variant="outline"
              className="border-red-600 text-red-400 hover:bg-red-700 hover:border-red-500"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
