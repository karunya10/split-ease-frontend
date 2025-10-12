"use client";

import { Users } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="text-center">
        <Users className="w-16 h-16 mx-auto text-gray-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-300 mb-2">
          Create your first group
        </h2>
        <p className="text-gray-400">
          Start splitting expenses with friends and family
        </p>
      </div>
    </div>
  );
}
