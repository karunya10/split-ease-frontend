"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { searchUsers } from "@/hooks/useGroups";
import { ApiError } from "@/types/dashboard";

export function useUserSearch() {
  return useMutation({
    mutationFn: searchUsers,
    onError: (error: ApiError) => {
      toast.error("Failed to search users", {
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    },
  });
}
