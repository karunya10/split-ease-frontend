import axiosClient from "@/lib/axiosClient";
import {
  Group,
  GroupDetail,
  SettlementSummary,
  Settlement,
  Expense,
  GroupMember,
  User,
} from "@/types/dashboard";

// API functions for dashboard
export const groupsApi = {
  fetchGroups: async (): Promise<Group[]> => {
    const { data } = await axiosClient.get("/groups");
    return data;
  },

  fetchGroupDetail: async (groupId: string): Promise<GroupDetail> => {
    const { data } = await axiosClient.get(`/groups/${groupId}`);
    return data;
  },

  createGroup: async (name: string): Promise<Group> => {
    const { data } = await axiosClient.post("/groups", { name });
    return data;
  },

  deleteGroup: async (groupId: string): Promise<void> => {
    await axiosClient.delete(`/groups/${groupId}`);
  },

  fetchSettlementSummary: async (
    groupId: string
  ): Promise<SettlementSummary> => {
    const { data } = await axiosClient.get(
      `/groups/${groupId}/settlements/summary`
    );
    return data;
  },

  fetchUserSettlements: async (): Promise<Settlement[]> => {
    const { data } = await axiosClient.get("/groups/settlements/user");
    return data;
  },

  createExpense: async (expense: {
    groupId: string;
    description: string;
    amount: number;
    paidById?: string;
    splits: { userId: string; amountOwed: number }[];
  }): Promise<Expense> => {
    const { groupId, ...expenseData } = expense;
    const { data } = await axiosClient.post(
      `/groups/${groupId}/expenses`,
      expenseData
    );
    return data;
  },

  markSettlementPaid: async (settlementId: string): Promise<void> => {
    await axiosClient.patch(`/groups/settlements/${settlementId}/paid`);
  },

  addGroupMember: async (
    groupId: string,
    userId: string,
    role?: string
  ): Promise<GroupMember> => {
    const { data } = await axiosClient.post(`/groups/${groupId}/members`, {
      userId,
      role,
    });
    return data;
  },

  removeGroupMember: async (
    groupId: string,
    memberId: string
  ): Promise<void> => {
    await axiosClient.delete(`/groups/${groupId}/members/${memberId}`);
  },

  searchUsers: async (query: string): Promise<User[]> => {
    const { data } = await axiosClient.get(
      `/users/search?q=${encodeURIComponent(query)}`
    );
    return data.users || [];
  },
};
