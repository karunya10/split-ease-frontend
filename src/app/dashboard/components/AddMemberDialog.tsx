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
import { groupsApi } from "@/lib/dashboardApi";
import { User } from "@/types/dashboard";

interface AddMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
  onMemberAdded: () => void;
}

export default function AddMemberDialog({
  isOpen,
  onClose,
  groupId,
  groupName,
  onMemberAdded,
}: AddMemberDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Search for users
  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await groupsApi.searchUsers(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching users:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleAddMember = async (user: User) => {
    setIsAdding(true);
    try {
      await groupsApi.addGroupMember(groupId, user.id);
      onMemberAdded();
      setSearchQuery("");
      setSearchResults([]);
      onClose();
    } catch (error) {
      console.error("Error adding member:", error);
    } finally {
      setIsAdding(false);
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
              {isSearching && (
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
                    disabled={isAdding}
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
                    {isAdding ? (
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
              !isSearching && (
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
