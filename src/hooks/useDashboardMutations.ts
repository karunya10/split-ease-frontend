"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createGroup,
  deleteGroup,
  createExpense,
  markSettlementPaid,
  addGroupMember,
} from "@/hooks/useGroups";

import { ApiError, Group, Expense } from "@/types/dashboard";
import { formatCurrency } from "@/lib/dashboardUtils";

export function useDashboardMutations(selectedGroupId: string | null) {
  const queryClient = useQueryClient();

  // Create group mutation
  const createGroupMutation = useMutation({
    mutationFn: (name: string) => createGroup(name),
    onSuccess: (newGroup: Group) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Group created!", {
        description: `${newGroup.name} has been created successfully.`,
      });
    },
    onError: (error: ApiError) => {
      toast.error("Failed to create group", {
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    },
  });

  // Create expense mutation
  const createExpenseMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: (newExpense: Expense) => {
      queryClient.invalidateQueries({ queryKey: ["group", selectedGroupId] });
      queryClient.invalidateQueries({
        queryKey: ["settlement-summary", selectedGroupId],
      });
      toast.success("Expense added!", {
        description: `${newExpense.description} for ${formatCurrency(
          newExpense.amount
        )} has been added.`,
      });
    },
    onError: (error: ApiError) => {
      toast.error("Failed to add expense", {
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    },
  });

  // Mark settlement as paid mutation
  const markPaidMutation = useMutation({
    mutationFn: markSettlementPaid,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["settlement-summary", selectedGroupId],
      });
      toast.success("Settlement marked as paid!", {
        description: "The settlement has been updated successfully.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Failed to update settlement", {
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    },
  });

  // Delete group mutation
  const deleteGroupMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Group deleted!", {
        description: "The group has been deleted successfully.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Failed to delete group", {
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    },
  });

  // Add member mutation
  const addMemberMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role?: string }) =>
      addGroupMember(selectedGroupId!, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", selectedGroupId] });
      toast.success("Member added!", {
        description: "The member has been added to the group successfully.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Failed to add member", {
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    },
  });

  return {
    createGroupMutation,
    createExpenseMutation,
    markPaidMutation,
    deleteGroupMutation,
    addMemberMutation,
  };
}
