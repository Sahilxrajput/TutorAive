import React, { createContext, useContext, useMemo } from "react";
import useSocket from "../hooks/useSocket";
import type { IUser } from "../types/type";

interface SocketContextValue {
  socket: ReturnType<typeof useSocket>["socket"];
  isConnected: boolean;
  onlineUsers: ReturnType<typeof useSocket>["onlineUsers"];
  sendMessage: ReturnType<typeof useSocket>["sendMessage"];
  emitCustomEvent: ReturnType<typeof useSocket>["emitCustomEvent"];
  disconnectSocket: ReturnType<typeof useSocket>["disconnectSocket"];
  reconnectSocket: ReturnType<typeof useSocket>["reconnectSocket"];
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export const SocketProvider: React.FC<{ user?: IUser; children: React.ReactNode }> = ({ user, children }) => {
  const socketData = useSocket(user);

  // Memoize context value to prevent unnecessary rerenders
  const value = useMemo(() => socketData, [socketData]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocketContext = (): SocketContextValue => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};
