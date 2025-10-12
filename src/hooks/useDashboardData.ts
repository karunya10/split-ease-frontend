"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Group } from "@/types/dashboard";
import {
  fetchGroups,
  fetchGroupDetail,
  fetchSettlementSummary,
} from "@/hooks/useGroups";

export function useDashboardData(userId?: string) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Fetch user's groups
  const { data: groups = [], error: groupsError } = useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: fetchGroups,
    enabled: !!userId,
  });

  // Fetch selected group details
  const { data: selectedGroup } = useQuery({
    queryKey: ["group", selectedGroupId],
    queryFn: () => fetchGroupDetail(selectedGroupId!),
    enabled: !!selectedGroupId,
  });

  // Fetch settlement summary for selected group
  const { data: settlementSummary } = useQuery({
    queryKey: ["settlement-summary", selectedGroupId],
    queryFn: () => fetchSettlementSummary(selectedGroupId!),
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
