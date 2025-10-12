"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Users,
  Crown,
  Shield,
  User as UserIcon,
  UserPlus,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboard } from "@/contexts/DashboardContext";
import { fetchGroupDetail } from "@/hooks/useGroups";

interface GroupMembersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: () => void;
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case "owner":
      return <Crown className="w-4 h-4 text-yellow-500" />;
    case "admin":
      return <Shield className="w-4 h-4 text-blue-500" />;
    default:
      return <UserIcon className="w-4 h-4 text-gray-500" />;
  }
};

const getRoleText = (role: string) => {
  switch (role) {
    case "owner":
      return "Owner";
    case "admin":
      return "Admin";
    default:
      return "Member";
  }
};

const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case "owner":
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    case "admin":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    default:
      return "bg-gray-500/20 text-gray-300 border-gray-500/30";
  }
};

export default function GroupMembersDialog({
  isOpen,
  onClose,
  onAddMember,
}: GroupMembersDialogProps) {
  const { user } = useAuth();
  const { selectedGroupId } = useDashboard();

  // Fetch selected group details to get members
  const { data: selectedGroup, isLoading } = useQuery({
    queryKey: ["group", selectedGroupId],
    queryFn: () => fetchGroupDetail(selectedGroupId!),
    enabled: !!selectedGroupId && isOpen,
  });

  // Get current user's role in the selected group
  const getCurrentUserRole = () => {
    if (!selectedGroup || !user) return "member";
    const currentUserMembership = selectedGroup.members.find(
      (member) => member.userId === user.id
    );
    return currentUserMembership?.role || "member";
  };

  const members = selectedGroup?.members || [];
  const groupName = selectedGroup?.name || "";
  const currentUserRole = getCurrentUserRole();

  return (
    <Dialog isOpen={isOpen} onClose={onClose} className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          {groupName} Members
        </DialogTitle>
      </DialogHeader>
      <DialogContent>
        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {members.length === 0 ? (
                <p className="text-gray-400 text-center py-4">
                  No members found
                </p>
              ) : (
                members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {(member.user.name || member.user.email)
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {member.user.name || member.user.email}
                        </div>
                        {member.user.name && (
                          <div className="text-sm text-gray-400">
                            {member.user.email}
                          </div>
                        )}
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${getRoleBadgeClass(
                        member.role
                      )}`}
                    >
                      {getRoleIcon(member.role)}
                      {getRoleText(member.role)}
                    </div>
                  </div>
                ))
              )}
            </div>
            {members.length > 0 && (
              <div className="mt-4 text-sm text-gray-400 text-center">
                {members.length} member{members.length !== 1 ? "s" : ""} total
              </div>
            )}
          </>
        )}
      </DialogContent>
      <DialogFooter>
        {(currentUserRole === "owner" || currentUserRole === "admin") && (
          <Button
            onClick={onAddMember}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        )}
        <Button variant="ghost" onClick={onClose} className="text-gray-300">
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
