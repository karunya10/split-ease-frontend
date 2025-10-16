"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createGroup,
  updateGroup,
  deleteGroup,
  createExpense,
  deleteExpense,
  markSettlementPaid,
  addGroupMember,
} from "@/hooks/useGroups";

import { ApiError, Group, Expense } from "@/types/dashboard";
import { formatCurrency } from "@/lib/dashboardUtils";

export function useDashboardMutations(selectedGroupId: string | null) {
  const queryClient = useQueryClient();

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

  const updateGroupMutation = useMutation({
    mutationFn: ({ groupId, name }: { groupId: string; name: string }) =>
      updateGroup(groupId, name),
    onSuccess: (updatedGroup: Group) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["group", updatedGroup.id] });
      toast.success("Group updated!", {
        description: `Group name has been updated to "${updatedGroup.name}".`,
      });
    },
    onError: (error: ApiError) => {
      toast.error("Failed to update group", {
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    },
  });

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

  const deleteGroupMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: (_, deletedGroupId) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });

      queryClient.removeQueries({ queryKey: ["group", deletedGroupId] });
      queryClient.removeQueries({
        queryKey: ["settlement-summary", deletedGroupId],
      });

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

  const deleteExpenseMutation = useMutation({
    mutationFn: ({
      groupId,
      expenseId,
    }: {
      groupId: string;
      expenseId: string;
    }) => deleteExpense(groupId, expenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", selectedGroupId] });
      queryClient.invalidateQueries({
        queryKey: ["settlement-summary", selectedGroupId],
      });
      toast.success("Expense deleted!", {
        description: "The expense has been deleted successfully.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Failed to delete expense", {
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    },
  });

  return {
    createGroupMutation,
    updateGroupMutation,
    createExpenseMutation,
    deleteExpenseMutation,
    markPaidMutation,
    deleteGroupMutation,
    addMemberMutation,
  };
}
