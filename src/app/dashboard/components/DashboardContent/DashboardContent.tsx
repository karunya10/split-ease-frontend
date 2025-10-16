"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Group } from "@/types/dashboard";
import { useDashboard } from "@/contexts/DashboardContext";
import { useDashboardMutations } from "@/hooks/useDashboardMutations";
import { fetchGroupDetail, fetchGroups } from "@/hooks/useGroups";
import GroupHeader from "./components/GroupHeader";
import ExpensesList from "./components/ExpensesList";
import BalanceSummary from "./components/BalanceSummary";
import SettlementsList from "./components/SettlementsList";
import EmptyState from "./components/EmptyState";
import EditGroupDialog from "../EditGroupDialog";
import GroupChat from "../GroupChat";

interface DashboardContentProps {
  currentUser: User;
  onMarkAsPaid: (settlementId: string) => void;
}

export default function DashboardContent({
  currentUser,
  onMarkAsPaid,
}: DashboardContentProps) {
  const [showEditGroupDialog, setShowEditGroupDialog] = useState(false);

  const {
    selectedGroupId,
    setShowCreateExpenseForm,
    setShowGroupMembers,
    setShowDeleteGroup,
    showGroupChat,
    setShowGroupChat,
  } = useDashboard();

  const { updateGroupMutation, deleteExpenseMutation } =
    useDashboardMutations(selectedGroupId);

  const handleUpdateGroup = (groupId: string, name: string) => {
    updateGroupMutation.mutate({ groupId, name });
  };

  const handleDeleteExpense = (expenseId: string) => {
    deleteExpenseMutation.mutate({ groupId: selectedGroupId!, expenseId });
  };

  const { data: groups = [] } = useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: fetchGroups,
  });

  const { data: selectedGroup } = useQuery({
    queryKey: ["group", selectedGroupId],
    queryFn: () => fetchGroupDetail(selectedGroupId!),
    enabled: !!selectedGroupId,
  });

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
        onEditGroup={() => setShowEditGroupDialog(true)}
        onOpenChat={() => setShowGroupChat(true)}
        currentUserRole={getCurrentUserRole()}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ExpensesList
            expenses={selectedGroup.expenses}
            currentUser={currentUser}
            onAddExpense={() => setShowCreateExpenseForm(true)}
            onDeleteExpense={handleDeleteExpense}
          />
        </div>

        <div className="space-y-6">
          <BalanceSummary />
          <SettlementsList
            currentUser={currentUser}
            onMarkAsPaid={onMarkAsPaid}
          />
        </div>
      </div>

      {showEditGroupDialog && (
        <EditGroupDialog
          isOpen={showEditGroupDialog}
          onClose={() => setShowEditGroupDialog(false)}
          group={selectedGroup}
          onUpdateGroup={handleUpdateGroup}
          isLoading={updateGroupMutation.isPending}
        />
      )}

      {showGroupChat && selectedGroup && (
        <GroupChat
          isOpen={showGroupChat}
          onClose={() => setShowGroupChat(false)}
          groupId={selectedGroup.id}
          groupName={selectedGroup.name}
        />
      )}
    </div>
  );
}
