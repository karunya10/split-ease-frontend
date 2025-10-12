"use client";

import { GroupDetail, SettlementSummary, User } from "@/types/dashboard";
import GroupHeader from "./GroupHeader";
import ExpensesList from "./ExpensesList";
import BalanceSummary from "./BalanceSummary";
import SettlementsList from "./SettlementsList";
import EmptyState from "./EmptyState";

interface DashboardContentProps {
  selectedGroup?: GroupDetail;
  settlementSummary?: SettlementSummary;
  currentUser: User;
  hasGroups: boolean;
  onAddExpense: () => void;
  onMarkAsPaid: (settlementId: string) => void;
  onViewMembers: () => void;
  onDeleteGroup: () => void;
}

export default function DashboardContent({
  selectedGroup,
  settlementSummary,
  currentUser,
  hasGroups,
  onAddExpense,
  onMarkAsPaid,
  onViewMembers,
  onDeleteGroup,
}: DashboardContentProps) {
  // Get current user's role in the selected group
  const getCurrentUserRole = () => {
    if (!selectedGroup || !currentUser) return "member";
    const currentUserMembership = selectedGroup.members.find(
      (member) => member.userId === currentUser.id
    );
    console.log("Debug - Current User ID:", currentUser.id);
    console.log("Debug - Group Members:", selectedGroup.members);
    console.log("Debug - Current User Membership:", currentUserMembership);
    console.log("Debug - User Role:", currentUserMembership?.role || "member");
    return currentUserMembership?.role || "member";
  };
  if (!selectedGroup) {
    return <EmptyState hasGroups={hasGroups} />;
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
          <BalanceSummary settlementSummary={settlementSummary} />
          <SettlementsList
            settlementSummary={settlementSummary}
            currentUser={currentUser}
            onMarkAsPaid={onMarkAsPaid}
          />
        </div>
      </div>
    </div>
  );
}
