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
import { Loader2 } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";

interface CreateGroupDialogProps {
  onSubmit: () => void;
  isCreating: boolean;
}

export default function CreateGroupDialog({
  onSubmit,
  isCreating,
}: CreateGroupDialogProps) {
  const {
    showCreateGroupForm,
    setShowCreateGroupForm,
    newGroupName,
    setNewGroupName,
    resetNewGroupForm,
  } = useDashboard();

  const handleSubmit = () => {
    onSubmit();
  };

  const handleClose = () => {
    setShowCreateGroupForm(false);
    resetNewGroupForm();
  };

  return (
    <Dialog
      isOpen={showCreateGroupForm}
      onClose={handleClose}
      className="max-w-md"
    >
      <DialogHeader>
        <DialogTitle>Create New Group</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="groupName" className="text-white">
              Group Name
            </Label>
            <Input
              id="groupName"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Enter group name"
              className="mt-2 bg-gray-600 border-gray-500 text-white"
              autoFocus
            />
          </div>
          <div className="text-gray-400 text-sm">
            You can add members after creating the group by clicking the
            &quot;Members&quot; button.
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <Button variant="ghost" onClick={handleClose} className="text-gray-300">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!newGroupName.trim() || isCreating}
          className="bg-teal-600 hover:bg-teal-700"
        >
          {isCreating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : null}
          Create Group
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
