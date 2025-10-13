"use client";

import { useQuery } from "@tanstack/react-query";
import { User, Group } from "@/types/dashboard";
import { useDashboard } from "@/contexts/DashboardContext";
import { fetchGroupDetail, fetchGroups } from "@/hooks/useGroups";
import GroupHeader from "./components/GroupHeader";
import ExpensesList from "./components/ExpensesList";
import BalanceSummary from "./components/BalanceSummary";
import SettlementsList from "./components/SettlementsList";
import EmptyState from "./components/EmptyState";

interface DashboardContentProps {
  currentUser: User;
  onMarkAsPaid: (settlementId: string) => void;
}

export default function DashboardContent({
  currentUser,
  onMarkAsPaid,
}: DashboardContentProps) {
  const {
    selectedGroupId,
    setShowCreateExpenseForm,
    setShowGroupMembers,
    setShowDeleteGroup,
  } = useDashboard();

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
        onAddExpense={() => setShowCreateExpenseForm(true)}
        onViewMembers={() => setShowGroupMembers(true)}
        onDeleteGroup={() => setShowDeleteGroup(true)}
        currentUserRole={getCurrentUserRole()}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ExpensesList
            expenses={selectedGroup.expenses}
            currentUser={currentUser}
            onAddExpense={() => setShowCreateExpenseForm(true)}
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
