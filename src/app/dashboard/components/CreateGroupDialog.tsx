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

interface CreateGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  onGroupNameChange: (name: string) => void;
  onSubmit: (name: string) => void;
  isCreating: boolean;
}

export default function CreateGroupDialog({
  isOpen,
  onClose,
  groupName,
  onGroupNameChange,
  onSubmit,
  isCreating,
}: CreateGroupDialogProps) {
  const handleSubmit = () => {
    onSubmit(groupName);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} className="max-w-md">
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
              value={groupName}
              onChange={(e) => onGroupNameChange(e.target.value)}
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
        <Button variant="ghost" onClick={onClose} className="text-gray-300">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!groupName.trim() || isCreating}
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
