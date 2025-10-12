"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Users, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { GroupMember } from "@/types/dashboard";

interface CreateExpenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  expense: {
    description: string;
    amount: string;
    splits: { userId: string; amountOwed: number }[];
  };
  onExpenseChange: (expense: {
    description: string;
    amount: string;
    splits: { userId: string; amountOwed: number }[];
  }) => void;
  onSubmit: () => void;
  isCreating: boolean;
  groupMembers: GroupMember[];
}

export default function CreateExpenseDialog({
  isOpen,
  onClose,
  expense,
  onExpenseChange,
  onSubmit,
  isCreating,
  groupMembers,
}: CreateExpenseDialogProps) {
  const [splitMode, setSplitMode] = useState<"equal" | "custom">("equal");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Initialize selected members when dialog opens
  useEffect(() => {
    if (isOpen && selectedMembers.length === 0) {
      setSelectedMembers(groupMembers.map((member) => member.userId));
    }
  }, [isOpen, groupMembers, selectedMembers.length]);

  // Calculate splits when amount or selected members change
  useEffect(() => {
    if (expense.amount && selectedMembers.length > 0) {
      const amount = parseFloat(expense.amount);
      if (amount > 0 && splitMode === "equal") {
        const amountPerPerson = amount / selectedMembers.length;
        const newSplits = selectedMembers.map((userId) => ({
          userId,
          amountOwed: amountPerPerson,
        }));
        onExpenseChange({ ...expense, splits: newSplits });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expense.amount, selectedMembers, splitMode]);

  const handleMemberToggle = (userId: string) => {
    const newSelected = selectedMembers.includes(userId)
      ? selectedMembers.filter((id) => id !== userId)
      : [...selectedMembers, userId];
    setSelectedMembers(newSelected);
  };

  const handleCustomSplitChange = (userId: string, amount: string) => {
    const numAmount = parseFloat(amount) || 0;
    const newSplits = expense.splits.map((split) =>
      split.userId === userId ? { ...split, amountOwed: numAmount } : split
    );
    onExpenseChange({ ...expense, splits: newSplits });
  };

  const handleClose = () => {
    setSplitMode("equal");
    setSelectedMembers([]);
    onClose();
  };

  const getTotalSplit = () => {
    return expense.splits.reduce((total, split) => total + split.amountOwed, 0);
  };

  const isValidSplit = () => {
    const totalAmount = parseFloat(expense.amount) || 0;
    const totalSplit = getTotalSplit();
    return Math.abs(totalAmount - totalSplit) < 0.01; // Allow for small rounding errors
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Add New Expense</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description" className="text-white">
                Description
              </Label>
              <Input
                id="description"
                value={expense.description}
                onChange={(e) =>
                  onExpenseChange({ ...expense, description: e.target.value })
                }
                placeholder="What was this expense for?"
                className="mt-2 bg-gray-600 border-gray-500 text-white"
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="amount" className="text-white">
                Amount ($)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={expense.amount}
                onChange={(e) =>
                  onExpenseChange({ ...expense, amount: e.target.value })
                }
                placeholder="0.00"
                className="mt-2 bg-gray-600 border-gray-500 text-white"
              />
            </div>
          </div>

          {/* Split Mode Selection */}
          <div>
            <Label className="text-white">Split Method</Label>
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                variant={splitMode === "equal" ? "default" : "ghost"}
                onClick={() => setSplitMode("equal")}
                className={`${
                  splitMode === "equal"
                    ? "bg-teal-600 hover:bg-teal-700"
                    : "text-gray-300"
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                Equal Split
              </Button>
              <Button
                type="button"
                variant={splitMode === "custom" ? "default" : "ghost"}
                onClick={() => setSplitMode("custom")}
                className={`${
                  splitMode === "custom"
                    ? "bg-teal-600 hover:bg-teal-700"
                    : "text-gray-300"
                }`}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Custom Split
              </Button>
            </div>
          </div>

          {/* Member Selection */}
          <div>
            <Label className="text-white">
              Select Members ({selectedMembers.length}/{groupMembers.length})
            </Label>
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
              {groupMembers.map((member) => {
                const isSelected = selectedMembers.includes(member.userId);
                const memberSplit = expense.splits.find(
                  (split) => split.userId === member.userId
                );

                return (
                  <div
                    key={member.userId}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isSelected
                        ? "bg-gray-700 border-teal-600"
                        : "bg-gray-800 border-gray-600"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleMemberToggle(member.userId)}
                        className="w-4 h-4 text-teal-600 bg-gray-600 border-gray-500 rounded focus:ring-teal-500"
                      />
                      <div>
                        <div className="text-white font-medium">
                          {member.user.name || member.user.email}
                        </div>
                        {member.user.name && (
                          <div className="text-gray-400 text-sm">
                            {member.user.email}
                          </div>
                        )}
                      </div>
                    </div>

                    {isSelected && splitMode === "custom" && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 text-sm">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={memberSplit?.amountOwed || 0}
                          onChange={(e) =>
                            handleCustomSplitChange(
                              member.userId,
                              e.target.value
                            )
                          }
                          className="w-20 bg-gray-600 border-gray-500 text-white text-sm"
                        />
                      </div>
                    )}

                    {isSelected && splitMode === "equal" && memberSplit && (
                      <div className="text-teal-400 font-medium">
                        ${memberSplit.amountOwed.toFixed(2)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Split Summary */}
          {splitMode === "custom" && expense.amount && (
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Amount:</span>
                <span className="text-white">${expense.amount}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-400">Total Split:</span>
                <span
                  className={isValidSplit() ? "text-green-400" : "text-red-400"}
                >
                  ${getTotalSplit().toFixed(2)}
                </span>
              </div>
              {!isValidSplit() && (
                <div className="text-red-400 text-xs mt-1">
                  Split amounts must equal the total expense amount
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
      <DialogFooter>
        <Button variant="ghost" onClick={handleClose} className="text-gray-300">
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={
            !expense.description ||
            !expense.amount ||
            selectedMembers.length === 0 ||
            (splitMode === "custom" && !isValidSplit()) ||
            isCreating
          }
          className="bg-teal-600 hover:bg-teal-700"
        >
          {isCreating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : null}
          Add Expense
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
