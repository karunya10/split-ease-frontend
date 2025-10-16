export interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Conversation {
  id: string;
  groupId: string;
}
