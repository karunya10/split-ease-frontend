export interface User {
  id: string;
  name?: string;
  email: string;
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: "owner" | "admin" | "member";
  user: User;
}

export interface Group {
  id: string;
  name: string;
  createdAt: string;
  members: GroupMember[];
  _count: {
    expenses: number;
  };
}

export interface ExpenseSplit {
  id: string;
  expenseId: string;
  userId: string;
  amountOwed: number;
  user: User;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidById: string;
  groupId: string;
  createdAt: string;
  paidBy: User;
  splits: ExpenseSplit[];
}

export interface Settlement {
  id: string;
  fromUserId: string;
  toUserId: string;
  groupId: string;
  amount: number;
  status: "PENDING" | "PAID";
  createdAt: string;
  fromUser: User;
  toUser: User;
  group?: {
    id: string;
    name: string;
  };
}

export interface GroupDetail extends Group {
  expenses: Expense[];
}

export interface SettlementSummary {
  settlements: Settlement[];
  totalOwed: number;
  totalOwing: number;
  netBalance: number;
}
