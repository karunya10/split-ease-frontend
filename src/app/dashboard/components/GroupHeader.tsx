"use client";

import { Button } from "@/components/ui/button";
import { Plus, Users, MoreVertical, Trash2 } from "lucide-react";
import { GroupDetail, SettlementSummary } from "@/types/dashboard";
import {
  getGroupAvatar,
  getBalanceColor,
  formatCurrency,
  formatDate,
} from "@/lib/dashboardUtils";
import { useState, useRef, useEffect } from "react";

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
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);
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
            <div className="relative" ref={dropdownRef}>
              <Button
                onClick={() => setShowDropdown(!showDropdown)}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 p-2"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                  <button
                    onClick={() => {
                      onDeleteGroup();
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 flex items-center gap-2 rounded-md"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Group
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
