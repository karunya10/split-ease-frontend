"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  groupId: string;
  onConfirm: (groupId: string) => void;
  isDeleting: boolean;
}

export default function DeleteGroupDialog({
  isOpen,
  onClose,
  groupName,
  groupId,
  onConfirm,
  isDeleting,
}: DeleteGroupDialogProps) {
  const [confirmationText, setConfirmationText] = useState("");
  const isConfirmationValid = confirmationText === groupName;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isConfirmationValid) {
      onConfirm(groupId);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmationText("");
      onClose();
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="w-5 h-5" />
          Delete Group
        </DialogTitle>
      </DialogHeader>

      <DialogContent>
        <div className="text-gray-300 mb-4">
          This action cannot be undone. This will permanently delete the group{" "}
          <span className="font-semibold text-white">
            &ldquo;{groupName}&rdquo;
          </span>{" "}
          and all associated expenses and settlements.
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="confirmation" className="text-gray-300">
                Type{" "}
                <span className="font-semibold">&ldquo;{groupName}&rdquo;</span>{" "}
                to confirm:
              </Label>
              <Input
                id="confirmation"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder={groupName}
                className="bg-gray-700 border-gray-600 text-white mt-2"
                disabled={isDeleting}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isDeleting}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isConfirmationValid || isDeleting}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Group"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
