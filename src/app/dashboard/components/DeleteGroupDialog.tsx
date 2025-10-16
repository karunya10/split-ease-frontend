"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useDashboard } from "@/contexts/DashboardContext";
import { fetchGroupDetail } from "@/hooks/useGroups";

interface DeleteGroupDialogProps {
  onConfirm: () => void;
  isDeleting: boolean;
}

export default function DeleteGroupDialog({
  onConfirm,
  isDeleting,
}: DeleteGroupDialogProps) {
  const { selectedGroupId, showDeleteGroup, setShowDeleteGroup } =
    useDashboard();

  const { data: selectedGroup } = useQuery({
    queryKey: ["group", selectedGroupId],
    queryFn: () => fetchGroupDetail(selectedGroupId!),
    enabled: !!selectedGroupId && showDeleteGroup,
  });

  const groupName = selectedGroup?.name || "";

  const handleClose = () => {
    if (!isDeleting) {
      setShowDeleteGroup(false);
    }
  };

  return (
    <Dialog isOpen={showDeleteGroup} onClose={handleClose}>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="w-5 h-5" />
          Delete Group
        </DialogTitle>
      </DialogHeader>

      <DialogContent>
        <div className="text-gray-300 mb-6">
          Are you sure you want to delete the group{" "}
          <span className="font-semibold text-white">
            &ldquo;{groupName}&rdquo;
          </span>
          ? This action cannot be undone and will permanently delete all
          associated expenses and settlements.
        </div>

        <DialogFooter>
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
            onClick={onConfirm}
            disabled={isDeleting}
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
      </DialogContent>
    </Dialog>
  );
}
