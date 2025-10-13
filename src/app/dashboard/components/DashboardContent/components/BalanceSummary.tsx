"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useDashboard } from "@/contexts/DashboardContext";
import { fetchSettlementSummary } from "@/hooks/useGroups";
import { formatCurrency, getBalanceColor } from "@/lib/dashboardUtils";

export default function BalanceSummary() {
  const { selectedGroupId } = useDashboard();

  // Fetch settlement summary for selected group
  const { data: settlementSummary } = useQuery({
    queryKey: ["settlement-summary", selectedGroupId],
    queryFn: () => fetchSettlementSummary(selectedGroupId!),
    enabled: !!selectedGroupId,
  });

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Balance Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {settlementSummary ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Net Balance</p>
              <p
                className={`text-3xl font-bold ${getBalanceColor(
                  settlementSummary.netBalance
                )}`}
              >
                {settlementSummary.netBalance >= 0 ? "+" : ""}
                {formatCurrency(settlementSummary.netBalance)}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {settlementSummary.netBalance >= 0 ? "You are owed" : "You owe"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-600">
              <div className="text-center">
                <p className="text-green-400 font-semibold">
                  {formatCurrency(settlementSummary.totalOwed)}
                </p>
                <p className="text-xs text-gray-400">Others owe you</p>
              </div>
              <div className="text-center">
                <p className="text-red-400 font-semibold">
                  {formatCurrency(settlementSummary.totalOwing)}
                </p>
                <p className="text-xs text-gray-400">You owe others</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
