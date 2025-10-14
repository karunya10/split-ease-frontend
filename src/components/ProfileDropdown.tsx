"use client";

import { LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ProfileDropdownProps {
  user: {
    name?: string;
    email: string;
  };
  onLogout: () => void;
}

export default function ProfileDropdown({
  user,
  onLogout,
}: ProfileDropdownProps) {
  const displayName = user.name || user.email.split("@")[0];
  const initials = displayName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 hover:bg-opacity-50 transition-colors outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-gray-900">
        <div className="w-8 h-8 bg-teal-400 rounded-full flex items-center justify-center text-gray-900 text-sm font-semibold">
          {initials}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-white">{displayName}</div>
          <div className="text-xs text-gray-400">{user.email}</div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 bg-gray-800 border-gray-700 text-white"
        sideOffset={5}
      >
        <DropdownMenuLabel className="text-gray-300">
          My Account
        </DropdownMenuLabel>

        <div className="px-2 py-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-400 rounded-full flex items-center justify-center text-gray-900 text-sm font-semibold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{displayName}</div>
              <div className="text-xs text-gray-400 truncate">{user.email}</div>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-gray-700" />

        <DropdownMenuItem
          onClick={onLogout}
          variant="destructive"
          className="cursor-pointer"
        >
          <LogOut />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
