"use client";

import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useDashboard } from "@/contexts/DashboardContext";
import { fetchGroups } from "@/hooks/useGroups";
import { Group } from "@/types/dashboard";
import { getGroupAvatar } from "@/lib/dashboardUtils";

interface DashboardSidebarProps {
  onCreateGroup: () => void;
  onCreateExpense: () => void;
  isCreatingGroup: boolean;
}

export default function DashboardSidebar({
  onCreateGroup,
  isCreatingGroup,
}: DashboardSidebarProps) {
  const { selectedGroupId, setSelectedGroupId } = useDashboard();

  const { data: groups = [] } = useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: fetchGroups,
  });

  return (
    <div className="w-80 bg-gradient-to-b from-gray-900 to-gray-800 relative">
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-gray-600/50 to-transparent"></div>

      <div className="p-6 h-full">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-6 tracking-tight text-center">
            Your Groups
          </h2>
          {groups.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-800/50 rounded-2xl flex items-center justify-center border border-gray-700/50">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No groups yet
              </h3>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                Start splitting expenses with friends and family
              </p>
              <Button
                onClick={onCreateGroup}
                className="bg-teal-600 hover:bg-teal-700 shadow-lg hover:shadow-teal-600/25 transition-all duration-200 font-medium px-6"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create your first group
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {groups.map((group) => {
                const isSelected = selectedGroupId === group.id;
                return (
                  <div
                    key={group.id}
                    onClick={() => setSelectedGroupId(group.id)}
                    className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-teal-600/10 border border-teal-500/20 shadow-lg shadow-teal-600/5"
                        : "hover:bg-gray-800/50 border border-transparent hover:border-gray-700/50"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-600/5 to-transparent rounded-xl"></div>
                    )}
                    <div className="relative flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-semibold transition-all duration-200 ${
                          isSelected
                            ? "bg-teal-600 text-white shadow-lg shadow-teal-600/25"
                            : "bg-gray-700 text-gray-300 group-hover:bg-gray-600"
                        }`}
                      >
                        {getGroupAvatar(group.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-semibold truncate transition-colors duration-200 ${
                            isSelected
                              ? "text-white"
                              : "text-gray-200 group-hover:text-white"
                          }`}
                        >
                          {group.name}
                        </h3>
                        <p
                          className={`text-sm transition-colors duration-200 ${
                            isSelected
                              ? "text-teal-200"
                              : "text-gray-400 group-hover:text-gray-300"
                          }`}
                        >
                          {group.members.length} members
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {groups.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-700/50">
              <Button
                onClick={onCreateGroup}
                className="w-full bg-gray-800/50 hover:bg-gray-700/80 text-gray-300 hover:text-white border border-gray-700/50 hover:border-gray-600 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                disabled={isCreatingGroup}
              >
                <Plus className="w-4 h-4 mr-2" />
                Group
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
