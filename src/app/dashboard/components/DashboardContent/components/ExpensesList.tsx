"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, CreditCard } from "lucide-react";
import { Expense, User } from "@/types/dashboard";
import { formatCurrency, formatDate } from "@/lib/dashboardUtils";

interface ExpensesListProps {
  expenses: Expense[];
  currentUser: User;
  onAddExpense: () => void;
}

export default function ExpensesList({
  expenses,
  currentUser,
  onAddExpense,
}: ExpensesListProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Recent Expenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400 mb-4">No expenses yet</p>
            <Button
              onClick={onAddExpense}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add first expense
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {expenses.map((expense) => {
              const userSplit = expense.splits.find(
                (split) => split.userId === currentUser.id
              );
              const splitInfo = userSplit
                ? `You owe ${formatCurrency(userSplit.amountOwed)}`
                :  "You paid";

              return (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-gray-750 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-lg">
                      💰
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {expense.description}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Added by {expense.paidBy.name || expense.paidBy.email} •{" "}
                        {splitInfo}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">
                      {formatCurrency(expense.amount)}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatDate(expense.createdAt)}
                    </p>
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
