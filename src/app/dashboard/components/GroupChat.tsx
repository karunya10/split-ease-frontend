"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Send, MessageCircle } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { Message } from "@/types/chat";
import { useAuth } from "@/hooks/useAuth";

interface GroupChatProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
}

function MessageBubble({
  message,
  isCurrentUser,
}: {
  message: Message;
  isCurrentUser: boolean;
}) {
  return (
    <div
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`max-w-xs px-3 py-2 rounded-lg ${
          isCurrentUser ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-900"
        }`}
      >
        {!isCurrentUser && (
          <div className="text-xs font-medium mb-1 opacity-70">
            {message.sender.name || message.sender.email}
          </div>
        )}
        <div className="text-sm">{message.content}</div>
      </div>
    </div>
  );
}

export default function GroupChat({
  isOpen,
  onClose,
  groupId,
  groupName,
}: GroupChatProps) {
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const { messages, isConnected, sendMessage } = useChat(groupId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!messageText.trim()) return;

    sendMessage(messageText);
    setMessageText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      className="sm:max-w-md h-[70vh] flex flex-col"
    >
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          {groupName} Chat
        </DialogTitle>
        <div className="flex items-center gap-2 text-sm">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-gray-400">
            {isConnected ? "Connected" : "Connecting..."}
          </span>
        </div>
      </DialogHeader>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No messages yet. Say hello! 👋</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isCurrentUser={message.senderId === user?.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex gap-2 p-4 border-t border-gray-700">
        <Input
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={!isConnected}
          className="flex-1"
        />
        <Button
          onClick={handleSend}
          disabled={!messageText.trim() || !isConnected}
          size="icon"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Dialog>
  );
}
