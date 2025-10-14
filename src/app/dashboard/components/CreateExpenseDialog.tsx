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
import { Loader2, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDashboard } from "@/contexts/DashboardContext";
import { fetchGroupDetail } from "@/hooks/useGroups";

interface CreateExpenseDialogProps {
  onSubmit: () => void;
  isCreating: boolean;
}

export default function CreateExpenseDialog({
  onSubmit,
  isCreating,
}: CreateExpenseDialogProps) {
  const {
    selectedGroupId,
    showCreateExpenseForm,
    setShowCreateExpenseForm,
    newExpense,
    setNewExpense,
    resetNewExpenseForm,
  } = useDashboard();
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Fetch selected group details to get members
  const { data: selectedGroup } = useQuery({
    queryKey: ["group", selectedGroupId],
    queryFn: () => fetchGroupDetail(selectedGroupId!),
    enabled: !!selectedGroupId && showCreateExpenseForm,
  });

  const groupMembers = selectedGroup?.members || [];

  // Initialize selected members when dialog opens
  useEffect(() => {
    if (
      showCreateExpenseForm &&
      selectedMembers.length === 0 &&
      groupMembers.length > 0
    ) {
      setSelectedMembers(groupMembers.map((member) => member.userId));
    }
  }, [showCreateExpenseForm, groupMembers, selectedMembers.length]);

  // Calculate splits when amount or selected members change
  useEffect(() => {
    if (newExpense.amount && selectedMembers.length > 0) {
      const amount = parseFloat(newExpense.amount);
      if (amount > 0) {
        const amountPerPerson = amount / selectedMembers.length;
        const newSplits = selectedMembers.map((userId) => ({
          userId,
          amountOwed: amountPerPerson,
        }));
        setNewExpense({ ...newExpense, splits: newSplits });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newExpense.amount, selectedMembers]);

  const handleMemberToggle = (userId: string) => {
    const newSelected = selectedMembers.includes(userId)
      ? selectedMembers.filter((id) => id !== userId)
      : [...selectedMembers, userId];
    setSelectedMembers(newSelected);
  };

  const handleClose = () => {
    setSelectedMembers([]);
    setShowCreateExpenseForm(false);
    resetNewExpenseForm();
  };

  return (
    <Dialog
      isOpen={showCreateExpenseForm}
      onClose={handleClose}
      className="max-w-2xl"
    >
      <DialogHeader>
        <DialogTitle>Add New Expense</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description" className="text-white">
                Description
              </Label>
              <Input
                id="description"
                value={newExpense.description}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, description: e.target.value })
                }
                placeholder="What was this expense for?"
                className="mt-2 bg-gray-600 border-gray-500 text-white"
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="amount" className="text-white">
                Amount (€)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={newExpense.amount}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, amount: e.target.value })
                }
                placeholder="0.00"
                className="mt-2 bg-gray-600 border-gray-500 text-white"
              />
            </div>
          </div>

          <div>
            <Label className="text-white">Split Method</Label>
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                variant="default"
                className="bg-teal-600 hover:bg-teal-700"
                disabled
              >
                <Users className="w-4 h-4 mr-2" />
                Equal Split
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-white">
              Select Members ({selectedMembers.length}/{groupMembers.length})
            </Label>
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
              {groupMembers.map((member) => {
                const isSelected = selectedMembers.includes(member.userId);
                const memberSplit = newExpense.splits.find(
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

                    {isSelected && memberSplit && (
                      <div className="text-teal-400 font-medium">
                        ${memberSplit.amountOwed.toFixed(2)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <Button variant="ghost" onClick={handleClose} className="text-gray-300">
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={
            !newExpense.description ||
            !newExpense.amount ||
            selectedMembers.length === 0 ||
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
