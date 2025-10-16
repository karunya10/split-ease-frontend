"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Search, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDashboard } from "@/contexts/DashboardContext";
import { fetchGroupDetail } from "@/hooks/useGroups";
import { useUserSearch } from "@/hooks/useUserSearch";
import { useDashboardMutations } from "@/hooks/useDashboardMutations";
import { User } from "@/types/dashboard";

interface AddMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMemberAdded: () => void;
}

export default function AddMemberDialog({
  isOpen,
  onClose,
  onMemberAdded,
}: AddMemberDialogProps) {
  const { selectedGroupId } = useDashboard();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const { data: selectedGroup } = useQuery({
    queryKey: ["group", selectedGroupId],
    queryFn: () => fetchGroupDetail(selectedGroupId!),
    enabled: !!selectedGroupId && isOpen,
  });

  const groupName = selectedGroup?.name || "";
  const { addMemberMutation } = useDashboardMutations(selectedGroupId);
  const userSearchMutation = useUserSearch();

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        const results = await userSearchMutation.mutateAsync(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching users:", error);
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, userSearchMutation]);

  const handleAddMember = async (user: User) => {
    try {
      await addMemberMutation.mutateAsync({ userId: user.id });
      onMemberAdded();
      setSearchQuery("");
      setSearchResults([]);
      onClose();
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setSearchResults([]);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Add Member to {groupName}
        </DialogTitle>
      </DialogHeader>
      <DialogContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="memberSearch" className="text-white">
              Search for User
            </Label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="memberSearch"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by email or name..."
                className="pl-10 bg-gray-600 border-gray-500 text-white"
                autoFocus
              />
              {userSearchMutation.isPending && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
              )}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 max-h-48 overflow-y-auto bg-gray-700 border border-gray-600 rounded-md">
                {searchResults.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleAddMember(user)}
                    disabled={addMemberMutation.isPending}
                    className="w-full text-left px-3 py-3 hover:bg-gray-600 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">
                        {user.name || user.email}
                      </div>
                      {user.name && (
                        <div className="text-gray-400 text-xs">
                          {user.email}
                        </div>
                      )}
                    </div>
                    {addMemberMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    ) : (
                      <UserPlus className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* No results found */}
            {searchQuery.trim().length >= 2 &&
              searchResults.length === 0 &&
              !userSearchMutation.isPending && (
                <div className="mt-2 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-400 text-sm">
                  No users found matching &quot;{searchQuery}&quot;
                </div>
              )}

            {/* Instructions */}
            {searchQuery.trim().length < 2 && (
              <div className="mt-2 text-gray-400 text-sm">
                Type at least 2 characters to search for users
              </div>
            )}
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <Button variant="ghost" onClick={handleClose} className="text-gray-300">
          Cancel
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
