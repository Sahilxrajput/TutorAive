import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { IUser } from "../types/auth";

interface User extends IUser {
  token?: string;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: User[];
  sendMessage: (message: string, roomId: string) => void;
  emitCustomEvent: (event: string, payload: any) => void;
  disconnectSocket: () => void;
  reconnectSocket: () => void;
}

const useSocket = (user?: User): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const backendUrl = useMemo(() => import.meta.env.VITE_SOCKET_URL as string, []);

  // --- Cleanup function ---
  const cleanupSocket = useCallback(() => {
    if (socketRef.current) {
      console.log("Disconnecting socket...");
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setSocket(null);
    setIsConnected(false);
    setOnlineUsers([]);
  }, []);

  // --- Initialize socket connection ---
  useEffect(() => {
    //Disconnect immediately if user logs out or token missing
    // if (!user?.token) {
    //   cleanupSocket();
    //   return;
    // }

    //Prevent duplicate connections
    if (socketRef.current?.connected) {
      console.log("Socket already connected, skipping init...");
      return;
    }

    // 🌐 Create new socket connection
    const newSocket: Socket = io(backendUrl, {
      // auth: { token: user.token },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // --- Core connection events ---
    newSocket.on("connect", () => {
      console.log("Connected to socket:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.warn("Disconnected from socket:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    newSocket.on("reconnect_attempt", (attempt) => {
      console.log(`Reconnecting attempt ${attempt}...`);
    });

    newSocket.on("reconnect", (attempt) => {
      console.log(`Reconnected after ${attempt} attempts`);
    });

    // --- Custom events ---
    newSocket.on("online_users_updated", (users: User[]) => {
      if (Array.isArray(users)) {
        setOnlineUsers(users);
      }
    });

    // store and update state
    socketRef.current = newSocket;
    setSocket(newSocket);

    // Cleanup on unmount or token change
    return () => cleanupSocket();
  }, [user, backendUrl, cleanupSocket]);

  // --- Emitters ---
  const sendMessage = useCallback((message: string, roomId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("send_message", { message, roomId });
    }
  }, []);

  const emitCustomEvent = useCallback((event: string, payload: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, payload);
    }
  }, []);

  // --- Manual socket controls ---
  const disconnectSocket = useCallback(() => {
    cleanupSocket();
  }, [cleanupSocket]);

  const reconnectSocket = useCallback(() => {
    if (socketRef.current && !socketRef.current.connected) {
      console.log(" Manually reconnecting socket...");
      socketRef.current.connect();
    }
  }, []);

  return {
    socket,
    isConnected,
    onlineUsers,
    sendMessage,
    emitCustomEvent,
    disconnectSocket,
    reconnectSocket,
  };
};

export default useSocket;
