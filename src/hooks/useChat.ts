import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Message, Conversation } from "@/types/chat";
import { useSocket } from "@/contexts/SocketContext";
import api from "@/lib/api";

const getOrCreateConversation = async (
  groupId: string
): Promise<Conversation> => {
  try {
    const response = await api.get(`/chat/groups/${groupId}/conversation`);
    return response.data;
  } catch {
    const response = await api.post(`/chat/groups/${groupId}/conversation`);
    return response.data;
  }
};

const getMessages = async (conversationId: string): Promise<Message[]> => {
  const response = await api.get(
    `/chat/conversations/${conversationId}/messages`
  );
  return response.data.messages || [];
};

export function useChat(groupId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const { socket, isConnected, sendMessage } = useSocket();

  const { data: conversation } = useQuery({
    queryKey: ["conversation", groupId],
    queryFn: () => getOrCreateConversation(groupId!),
    enabled: !!groupId,
  });

  const { data: fetchedMessages } = useQuery({
    queryKey: ["messages", conversation?.id],
    queryFn: () => getMessages(conversation!.id),
    enabled: !!conversation?.id,
  });

  useEffect(() => {
    if (fetchedMessages) {
      setMessages(fetchedMessages);
    }
  }, [fetchedMessages]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      console.log("📨 New message received:", message.content);
      setMessages((prev) => [...prev, message]);
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket]);

  const handleSendMessage = (content: string) => {
    if (!conversation?.id || !content.trim() || !isConnected) {
      console.log("❌ Cannot send message");
      return;
    }

    console.log("📤 Sending message:", content);
    sendMessage(conversation.id, content);
  };

  return {
    messages,
    isConnected,
    sendMessage: handleSendMessage,
  };
}
