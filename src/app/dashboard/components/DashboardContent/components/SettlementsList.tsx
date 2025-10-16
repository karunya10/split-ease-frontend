"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useDashboard } from "@/contexts/DashboardContext";
import { fetchSettlementSummary } from "@/hooks/useGroups";
import { User } from "@/types/dashboard";
import { formatCurrency } from "@/lib/dashboardUtils";

interface SettlementsListProps {
  currentUser: User;
  onMarkAsPaid: (settlementId: string) => void;
}

export default function SettlementsList({
  currentUser,
  onMarkAsPaid,
}: SettlementsListProps) {
  const { selectedGroupId } = useDashboard();

  const { data: settlementSummary } = useQuery({
    queryKey: ["settlement-summary", selectedGroupId],
    queryFn: () => fetchSettlementSummary(selectedGroupId!),
    enabled: !!selectedGroupId,
  });

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Settlements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {settlementSummary?.settlements.length === 0 ? (
          <div className="text-center py-4">
            <CheckCircle className="w-8 h-8 mx-auto text-green-400 mb-2" />
            <p className="text-gray-400 text-sm">All settled up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {settlementSummary?.settlements.map((settlement) => {
              const someoneOwesMe = settlement.toUserId === currentUser.id;

              const otherPerson = someoneOwesMe
                ? settlement.fromUser
                : settlement.toUser;

              const amountPrefix = someoneOwesMe ? "+" : "-";
              const amountColor = someoneOwesMe
                ? "text-green-400"
                : "text-red-400";
              const relationshipText = someoneOwesMe ? "owes you" : "you owe";

              const canMarkAsPaid =
                settlement.status === "PENDING" && !someoneOwesMe;

              return (
                <div
                  key={settlement.id}
                  className="flex items-center justify-between p-3 bg-gray-750 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm">
                      {otherPerson.name?.charAt(0) ||
                        otherPerson.email.charAt(0)}
                    </div>
                    <div>
                      <span className="text-white font-medium block">
                        {otherPerson.name || otherPerson.email}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-semibold ${amountColor}`}>
                      {amountPrefix}
                      {formatCurrency(settlement.amount)}
                    </p>
                    <p className="text-xs text-gray-400">{relationshipText}</p>
                    {canMarkAsPaid && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onMarkAsPaid(settlement.id)}
                        className="text-xs text-green-400 hover:text-green-300 p-0 h-auto mt-1"
                      >
                        Mark as paid
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
