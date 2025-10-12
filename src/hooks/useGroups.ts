import api from "@/lib/api";
import {
  Group,
  GroupDetail,
  SettlementSummary,
  Expense,
  GroupMember,
  User,
} from "@/types/dashboard";

// API functions
const fetchGroups = async (): Promise<Group[]> => {
  const { data } = await api.get("/groups");
  return data;
};

const fetchGroupDetail = async (groupId: string): Promise<GroupDetail> => {
  const { data } = await api.get(`/groups/${groupId}`);
  return data;
};

const createGroup = async (name: string): Promise<Group> => {
  const { data } = await api.post("/groups", { name });
  return data;
};

const deleteGroup = async (groupId: string): Promise<void> => {
  await api.delete(`/groups/${groupId}`);
};

const fetchSettlementSummary = async (
  groupId: string
): Promise<SettlementSummary> => {
  const { data } = await api.get(`/groups/${groupId}/settlements/summary`);
  return data;
};

const createExpense = async (expense: {
  groupId: string;
  description: string;
  amount: number;
  paidById?: string;
  splits: { userId: string; amountOwed: number }[];
}): Promise<Expense> => {
  const { groupId, ...expenseData } = expense;
  const { data } = await api.post(`/groups/${groupId}/expenses`, expenseData);
  return data;
};

const markSettlementPaid = async (settlementId: string): Promise<void> => {
  await api.patch(`/groups/settlements/${settlementId}/paid`);
};

const addGroupMember = async (
  groupId: string,
  userId: string,
  role?: string
): Promise<GroupMember> => {
  const { data } = await api.post(`/groups/${groupId}/members`, {
    userId,
    role,
  });
  return data;
};

const searchUsers = async (query: string): Promise<User[]> => {
  const { data } = await api.get(
    `/users/search?q=${encodeURIComponent(query)}`
  );
  return data.users || [];
};

// Export all API functions
export {
  fetchGroups,
  fetchGroupDetail,
  createGroup,
  deleteGroup,
  fetchSettlementSummary,
  createExpense,
  markSettlementPaid,
  addGroupMember,
  searchUsers,
};
