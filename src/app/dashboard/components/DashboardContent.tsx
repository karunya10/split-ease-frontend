"use client";

import { useQuery } from "@tanstack/react-query";
import { User, Group } from "@/types/dashboard";
import { useDashboard } from "@/contexts/DashboardContext";
import {
  fetchGroupDetail,
  fetchSettlementSummary,
  fetchGroups,
} from "@/hooks/useGroups";
import GroupHeader from "./GroupHeader";
import ExpensesList from "./ExpensesList";
import BalanceSummary from "./BalanceSummary";
import SettlementsList from "./SettlementsList";
import EmptyState from "./EmptyState";

interface DashboardContentProps {
  currentUser: User;
  onAddExpense: () => void;
  onMarkAsPaid: (settlementId: string) => void;
  onViewMembers: () => void;
  onDeleteGroup: () => void;
}

export default function DashboardContent({
  currentUser,
  onAddExpense,
  onMarkAsPaid,
  onViewMembers,
  onDeleteGroup,
}: DashboardContentProps) {
  const { selectedGroupId } = useDashboard();

  // Fetch user's groups for empty state check
  const { data: groups = [] } = useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: fetchGroups,
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

  // Get current user's role in the selected group
  const getCurrentUserRole = () => {
    const currentUserMembership = selectedGroup?.members.find(
      (member) => member.userId === currentUser.id
    );
    return currentUserMembership?.role || "member";
  };

  if (!selectedGroup || groups.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-8">
      <GroupHeader
        group={selectedGroup}
        settlementSummary={settlementSummary}
        onAddExpense={onAddExpense}
        onViewMembers={onViewMembers}
        onDeleteGroup={onDeleteGroup}
        currentUserRole={getCurrentUserRole()}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Expenses Section */}
        <div className="lg:col-span-2">
          <ExpensesList
            expenses={selectedGroup.expenses}
            currentUser={currentUser}
            onAddExpense={onAddExpense}
          />
        </div>

        {/* Balance & Settlements */}
        <div className="space-y-6">
          <BalanceSummary />
          <SettlementsList
            currentUser={currentUser}
            onMarkAsPaid={onMarkAsPaid}
          />
        </div>
      </div>
    </div>
  );
}
