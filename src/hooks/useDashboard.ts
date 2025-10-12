"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";
import { groupsApi } from "@/lib/dashboardApi";
import { ApiError } from "@/types/dashboard";
import { formatCurrency } from "@/lib/dashboardUtils";

export function useDashboardData(userId?: string) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Fetch user's groups
  const { data: groups = [], error: groupsError } = useQuery({
    queryKey: ["groups"],
    queryFn: groupsApi.fetchGroups,
    enabled: !!userId,
  });

  // Fetch selected group details
  const { data: selectedGroup } = useQuery({
    queryKey: ["group", selectedGroupId],
    queryFn: () => groupsApi.fetchGroupDetail(selectedGroupId!),
    enabled: !!selectedGroupId,
  });

  // Fetch settlement summary for selected group
  const { data: settlementSummary } = useQuery({
    queryKey: ["settlement-summary", selectedGroupId],
    queryFn: () => groupsApi.fetchSettlementSummary(selectedGroupId!),
    enabled: !!selectedGroupId,
  });

  // Reset selected group when user changes (userId becomes null or changes)
  useEffect(() => {
    if (!userId) {
      setSelectedGroupId(null);
    }
  }, [userId]);

  // Set first group as selected when groups load
  useEffect(() => {
    if (groups.length > 0 && !selectedGroupId) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups, selectedGroupId]);

  return {
    groups,
    selectedGroup,
    settlementSummary,
    selectedGroupId,
    setSelectedGroupId,
    groupsError,
  };
}

export function useDashboardMutations(selectedGroupId: string | null) {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  // Create group mutation
  const createGroupMutation = useMutation({
    mutationFn: (name: string) => groupsApi.createGroup(name),
    onSuccess: (newGroup) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      addToast({
        type: "success",
        title: "Group created!",
        description: `${newGroup.name} has been created successfully.`,
      });
    },
    onError: (error: ApiError) => {
      addToast({
        type: "error",
        title: "Failed to create group",
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    },
  });

  // Create expense mutation
  const createExpenseMutation = useMutation({
    mutationFn: groupsApi.createExpense,
    onSuccess: (newExpense) => {
      queryClient.invalidateQueries({ queryKey: ["group", selectedGroupId] });
      queryClient.invalidateQueries({
        queryKey: ["settlement-summary", selectedGroupId],
      });
      addToast({
        type: "success",
        title: "Expense added!",
        description: `${newExpense.description} for ${formatCurrency(
          newExpense.amount
        )} has been added.`,
      });
    },
    onError: (error: ApiError) => {
      addToast({
        type: "error",
        title: "Failed to add expense",
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    },
  });

  // Mark settlement as paid mutation
  const markPaidMutation = useMutation({
    mutationFn: groupsApi.markSettlementPaid,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["settlement-summary", selectedGroupId],
      });
      addToast({
        type: "success",
        title: "Settlement marked as paid!",
        description: "The settlement has been updated successfully.",
      });
    },
    onError: (error: ApiError) => {
      addToast({
        type: "error",
        title: "Failed to update settlement",
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    },
  });

  // Delete group mutation
  const deleteGroupMutation = useMutation({
    mutationFn: groupsApi.deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      addToast({
        type: "success",
        title: "Group deleted!",
        description: "The group has been deleted successfully.",
      });
    },
    onError: (error: ApiError) => {
      addToast({
        type: "error",
        title: "Failed to delete group",
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
  };
}
