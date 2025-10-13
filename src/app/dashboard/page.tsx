"use client";

import { useAuth } from "@/contexts/AuthContext";
import { DashboardProvider, useDashboard } from "@/contexts/DashboardContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/Header";
import { AlertCircle, Loader2 } from "lucide-react";
import { useDashboardMutations } from "@/hooks/useDashboardMutations";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { fetchGroups } from "@/hooks/useGroups";
import { Group } from "@/types/dashboard";

import DashboardSidebar from "./components/DashboardSidebar";
import DashboardContent from "./components/DashboardContent/DashboardContent";
import CreateGroupDialog from "./components/CreateGroupDialog";
import CreateExpenseDialog from "./components/CreateExpenseDialog";
import GroupMembersDialog from "./components/GroupMembersDialog";
import AddMemberDialog from "./components/AddMemberDialog";
import DeleteGroupDialog from "./components/DeleteGroupDialog";

function DashboardInner() {
  const { user, logout } = useAuth();
  const {
    selectedGroupId,
    setSelectedGroupId,
    setShowCreateGroupForm,
    setShowCreateExpenseForm,
    showAddMember,
    setShowAddMember,
    setShowDeleteGroup,
    newGroupName,
    newExpense,
    resetNewGroupForm,
    resetNewExpenseForm,
  } = useDashboard();

  // Fetch user's groups
  const { data: groups = [], error: groupsError } = useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: fetchGroups,
    enabled: !!user,
  });

  // Set first group as selected when groups load
  useEffect(() => {
    if (groups.length > 0 && !selectedGroupId) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups, selectedGroupId, setSelectedGroupId]);

  const queryClient = useQueryClient();

  const {
    createGroupMutation,
    createExpenseMutation,
    markPaidMutation,
    deleteGroupMutation,
  } = useDashboardMutations(selectedGroupId);

  // Handlers
  const handleCreateGroup = async () => {
    if (newGroupName.trim()) {
      try {
        const newGroup = await createGroupMutation.mutateAsync(
          newGroupName.trim()
        );
        setSelectedGroupId(newGroup.id);
        setShowCreateGroupForm(false);
        resetNewGroupForm();
      } catch (error) {
        console.error("Failed to create group:", error);
      }
    }
  };

  const handleCreateExpense = () => {
    // We need to get selected group data for this operation
    // This will be handled by fetching the group data in this component or the dialog
    if (selectedGroupId && newExpense.description && newExpense.amount) {
      const amount = parseFloat(newExpense.amount);
      if (amount > 0) {
        createExpenseMutation.mutate(
          {
            groupId: selectedGroupId,
            description: newExpense.description,
            amount,
            splits: newExpense.splits,
          },
          {
            onSuccess: () => {
              setShowCreateExpenseForm(false);
              resetNewExpenseForm();
            },
          }
        );
      }
    }
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
    if (selectedGroupId) {
      const deletedGroupId = selectedGroupId;
      deleteGroupMutation.mutate(selectedGroupId, {
        onSuccess: () => {
          setShowDeleteGroup(false);

          // Clear selected group immediately
          setSelectedGroupId(null);

          // The groups query will be invalidated by the mutation,
          // but we can also optimistically update the local state
          queryClient.setQueryData<Group[]>(["groups"], (oldGroups = []) => {
            return oldGroups.filter((g) => g.id !== deletedGroupId);
          });

          // After optimistic update, select first remaining group if any
          setTimeout(() => {
            const updatedGroups =
              queryClient.getQueryData<Group[]>(["groups"]) || [];
            if (updatedGroups.length > 0) {
              setSelectedGroupId(updatedGroups[0].id);
            }
          }, 100);
        },
      });
    }
  };

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
      <Header isAuthenticated={!!user} onLogout={logout} />

      <div className="flex h-screen">
        <DashboardSidebar isCreatingGroup={createGroupMutation.isPending} />

        <div className="flex-1 p-8 overflow-y-auto bg-gray-900">
          <DashboardContent
            currentUser={user!}
            onMarkAsPaid={(settlementId) =>
              markPaidMutation.mutate(settlementId)
            }
          />
        </div>
      </div>

      <CreateGroupDialog
        onSubmit={handleCreateGroup}
        isCreating={createGroupMutation.isPending}
      />

      <CreateExpenseDialog
        onSubmit={handleCreateExpense}
        isCreating={createExpenseMutation.isPending}
      />

      <GroupMembersDialog />

      <AddMemberDialog
        isOpen={showAddMember}
        onClose={() => setShowAddMember(false)}
        onMemberAdded={handleMemberAdded}
      />

      <DeleteGroupDialog
        onConfirm={handleDeleteGroup}
        isDeleting={deleteGroupMutation.isPending}
      />
    </div>
  );
}

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/");
    }
  }, [user, isLoading, router]);

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

  return (
    <DashboardProvider>
      <DashboardInner />
    </DashboardProvider>
  );
}
