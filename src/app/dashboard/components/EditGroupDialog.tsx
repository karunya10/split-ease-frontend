"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GroupDetail } from "@/types/dashboard";

interface EditGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  group: GroupDetail;
  onUpdateGroup: (groupId: string, name: string) => void;
  isLoading?: boolean;
}

export default function EditGroupDialog({
  isOpen,
  onClose,
  group,
  onUpdateGroup,
  isLoading = false,
}: EditGroupDialogProps) {
  const [groupName, setGroupName] = useState(group.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim() && groupName.trim() !== group.name) {
      onUpdateGroup(group.id, groupName.trim());
      onClose();
    }
  };

  const handleClose = () => {
    setGroupName(group.name);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
      <DialogHeader>
        <DialogTitle>Edit Group</DialogTitle>
        <p className="text-sm text-gray-400 mt-2">
          Update the name of your group. This change will be visible to all
          group members.
        </p>
      </DialogHeader>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              required
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !groupName.trim() ||
                groupName.trim() === group.name
              }
              className="bg-teal-600 hover:bg-teal-700"
            >
              {isLoading ? "Updating..." : "Update Group"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
