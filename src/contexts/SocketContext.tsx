"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/contexts/AuthContext";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  sendMessage: (conversationId: string, content: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("splitease_token");
    if (!token) return;

    const newSocket = io(
      process.env.NEXT_PUBLIC_SPLITEASE_BACKEND_URL || "http://localhost:4000",
      {
        auth: { token },
      }
    );

    newSocket.on("connect", () => {
      console.log("✅ Connected to chat");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from chat");
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
      setSocket(null);
      setIsConnected(false);
    };
  }, [user]);

  const sendMessage = (conversationId: string, content: string) => {
    if (socket && isConnected && content.trim()) {
      socket.emit("send_message", {
        conversationId,
        content: content.trim(),
      });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        sendMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
