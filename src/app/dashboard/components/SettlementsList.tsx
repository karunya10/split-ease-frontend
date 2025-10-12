"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CheckCircle } from "lucide-react";
import { SettlementSummary, User } from "@/types/dashboard";
import { formatCurrency } from "@/lib/dashboardUtils";

interface SettlementsListProps {
  settlementSummary?: SettlementSummary;
  currentUser: User;
  onMarkAsPaid: (settlementId: string) => void;
}

export default function SettlementsList({
  settlementSummary,
  currentUser,
  onMarkAsPaid,
}: SettlementsListProps) {
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
              const isOwed = settlement.toUserId === currentUser.id;
              const otherUser = isOwed
                ? settlement.fromUser
                : settlement.toUser;

              return (
                <div
                  key={settlement.id}
                  className="flex items-center justify-between p-3 bg-gray-750 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm">
                      {otherUser.name?.charAt(0) || otherUser.email.charAt(0)}
                    </div>
                    <div>
                      <span className="text-white font-medium block">
                        {otherUser.name || otherUser.email}
                      </span>
                      {settlement.status === "PAID" && (
                        <span className="text-xs text-green-400 flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Paid
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        isOwed ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {isOwed ? "+" : "-"}
                      {formatCurrency(settlement.amount)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {isOwed ? "owes you" : "you owe"}
                    </p>
                    {settlement.status === "PENDING" && !isOwed && (
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