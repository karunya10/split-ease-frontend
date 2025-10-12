"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { AlertCircle, Loader2 } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useDashboardMutations } from "@/hooks/useDashboardMutations";
import { useQueryClient } from "@tanstack/react-query";

import DashboardSidebar from "./components/DashboardSidebar";
import DashboardContent from "./components/DashboardContent";
import CreateGroupDialog from "./components/CreateGroupDialog";
import CreateExpenseDialog from "./components/CreateExpenseDialog";
import GroupMembersDialog from "./components/GroupMembersDialog";
import AddMemberDialog from "./components/AddMemberDialog";
import DeleteGroupDialog from "./components/DeleteGroupDialog";

export default function Dashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
  const [showCreateExpenseForm, setShowCreateExpenseForm] = useState(false);
  const [showGroupMembers, setShowGroupMembers] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showDeleteGroup, setShowDeleteGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    splits: [] as { userId: string; amountOwed: number }[],
  });

  const {
    groups,
    selectedGroup,
    settlementSummary,
    selectedGroupId,
    setSelectedGroupId,
    groupsError,
  } = useDashboardData(user?.id);

  const {
    createGroupMutation,
    createExpenseMutation,
    markPaidMutation,
    deleteGroupMutation,
  } = useDashboardMutations(selectedGroupId);

  // Redirect unauthenticated users to home
  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  // Handlers
  const handleCreateGroup = async (name: string) => {
    if (name.trim()) {
      try {
        const newGroup = await createGroupMutation.mutateAsync(name.trim());
        setSelectedGroupId(newGroup.id);
        setShowCreateGroupForm(false);
        setNewGroupName("");
      } catch (error) {
        console.error("Failed to create group:", error);
      }
    }
  };

  const handleCreateExpense = () => {
    if (selectedGroup && newExpense.description && newExpense.amount) {
      const amount = parseFloat(newExpense.amount);
      if (amount > 0) {
        // Default to equal split among all members if no custom splits
        let splits = newExpense.splits;
        if (splits.length === 0) {
          const amountPerPerson = amount / selectedGroup.members.length;
          splits = selectedGroup.members.map((member) => ({
            userId: member.userId,
            amountOwed: amountPerPerson,
          }));
        }

        createExpenseMutation.mutate(
          {
            groupId: selectedGroup.id,
            description: newExpense.description,
            amount,
            splits,
          },
          {
            onSuccess: () => {
              setShowCreateExpenseForm(false);
              setNewExpense({ description: "", amount: "", splits: [] });
            },
          }
        );
      }
    }
  };

  const handleCloseCreateGroupDialog = () => {
    setShowCreateGroupForm(false);
    setNewGroupName("");
  };

  const handleCloseCreateExpenseDialog = () => {
    setShowCreateExpenseForm(false);
    setNewExpense({ description: "", amount: "", splits: [] });
  };

  const handleMemberAdded = () => {
    // Refresh group data to show new member
    if (selectedGroupId) {
      // Invalidate and refetch group data instead of full page reload
      queryClient.invalidateQueries({ queryKey: ["group", selectedGroupId] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    }
  };

  const handleDeleteGroup = () => {
    if (selectedGroup) {
      deleteGroupMutation.mutate(selectedGroup.id, {
        onSuccess: () => {
          setShowDeleteGroup(false);
          // Clear selected group and redirect to first available group or empty state
          const remainingGroups = groups.filter(
            (g) => g.id !== selectedGroup.id
          );
          if (remainingGroups.length > 0) {
            setSelectedGroupId(remainingGroups[0].id);
          } else {
            setSelectedGroupId(null);
          }
        },
      });
    }
  };

  // Get current user's role in the selected group
  const getCurrentUserRole = () => {
    if (!selectedGroup || !user) return "member";
    const currentUserMembership = selectedGroup.members.find(
      (member) => member.userId === user.id
    );
    return currentUserMembership?.role || "member";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Redirecting...</div>
      </div>
    );
  }

  if (groupsError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>Error loading dashboard. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header isAuthenticated={user ? true : false} onLogout={logout} />

      <div className="flex h-screen pt-16">
        <DashboardSidebar
          groups={groups}
          selectedGroupId={selectedGroupId}
          onGroupSelect={setSelectedGroupId}
          onCreateGroup={() => setShowCreateGroupForm(true)}
          onCreateExpense={() => setShowCreateExpenseForm(true)}
          settlementSummary={settlementSummary}
          isCreatingGroup={createGroupMutation.isPending}
          hasSelectedGroup={!!selectedGroup}
        />

        <div className="flex-1 p-6 overflow-y-auto">
          <DashboardContent
            selectedGroup={selectedGroup}
            settlementSummary={settlementSummary}
            currentUser={user}
            hasGroups={groups.length > 0}
            onAddExpense={() => setShowCreateExpenseForm(true)}
            onMarkAsPaid={(settlementId) =>
              markPaidMutation.mutate(settlementId)
            }
            onViewMembers={() => setShowGroupMembers(true)}
            onDeleteGroup={() => setShowDeleteGroup(true)}
          />
        </div>
      </div>

      <CreateGroupDialog
        isOpen={showCreateGroupForm}
        onClose={handleCloseCreateGroupDialog}
        groupName={newGroupName}
        onGroupNameChange={setNewGroupName}
        onSubmit={handleCreateGroup}
        isCreating={createGroupMutation.isPending}
      />

      <CreateExpenseDialog
        isOpen={showCreateExpenseForm}
        onClose={handleCloseCreateExpenseDialog}
        expense={newExpense}
        onExpenseChange={setNewExpense}
        onSubmit={handleCreateExpense}
        isCreating={createExpenseMutation.isPending}
        groupMembers={selectedGroup?.members || []}
      />

      <GroupMembersDialog
        isOpen={showGroupMembers}
        onClose={() => setShowGroupMembers(false)}
        members={selectedGroup?.members || []}
        groupName={selectedGroup?.name || ""}
        groupId={selectedGroup?.id || ""}
        onAddMember={() => {
          setShowGroupMembers(false);
          setShowAddMember(true);
        }}
        currentUserRole={getCurrentUserRole()}
      />

      <AddMemberDialog
        isOpen={showAddMember}
        onClose={() => setShowAddMember(false)}
        groupId={selectedGroup?.id || ""}
        groupName={selectedGroup?.name || ""}
        onMemberAdded={handleMemberAdded}
      />

      <DeleteGroupDialog
        isOpen={showDeleteGroup}
        onClose={() => setShowDeleteGroup(false)}
        groupName={selectedGroup?.name || ""}
        groupId={selectedGroup?.id || ""}
        onConfirm={handleDeleteGroup}
        isDeleting={deleteGroupMutation.isPending}
      />
    </div>
  );
}
