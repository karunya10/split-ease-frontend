"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { GroupDetail } from "@/types/dashboard";
import { getGroupAvatar, formatDate } from "@/lib/dashboardUtils";

interface GroupHeaderProps {
  group: GroupDetail;
  onAddExpense: () => void;
  onViewMembers: () => void;
  onDeleteGroup: () => void;
  onEditGroup: () => void;
  currentUserRole: string;
}

export default function GroupHeader({
  group,
  onAddExpense,
  onViewMembers,
  onDeleteGroup,
  onEditGroup,
  currentUserRole,
}: GroupHeaderProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <div className="lg:col-span-2 flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-2xl">
          {getGroupAvatar(group.name)}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold">{group.name}</h1>
            {(currentUserRole === "owner" || currentUserRole === "admin") && (
              <button
                onClick={onEditGroup}
                className="text-gray-400 hover:text-teal-400 transition-colors p-1"
                title="Edit group name"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
          </div>
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

      <div className="flex items-center justify-end">
        <div className="flex gap-2 w-full">
          <Button
            onClick={onViewMembers}
            className="bg-teal-600 hover:bg-teal-700 flex-1"
          >
            <Plus className="w-4 h-4 mr-2" />
            Members
          </Button>
          <Button
            onClick={onAddExpense}
            className="bg-teal-600 hover:bg-teal-700 flex-1"
          >
            <Plus className="w-4 h-4 mr-2" />
            Expense
          </Button>
          {currentUserRole === "owner" && (
            <Button
              onClick={onDeleteGroup}
              variant="outline"
              className="border-red-600 text-red-400 hover:bg-red-700 hover:border-red-500 flex-1"
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
