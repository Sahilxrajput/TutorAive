import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { IUser } from "../types/type";
import useAuth from "./useAuth";

interface UseSocketReturn {
    socket: Socket | null;
    isConnected: boolean;
    onlineUsers: IUser[];
    sendMessage: (message: string, roomId: string) => void;
    disconnectSocket: () => void;
    reconnectSocket: () => void;
}

const useSocketHandler = (user?: IUser): UseSocketReturn => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<IUser[]>([]);
    const socketRef = useRef<Socket | null>(null);
    const { accessToken } = useAuth();

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
        // 1. No token → no socket
        const token = localStorage.getItem("accessToken");
        // console.log("localstorage token: ", token)

        // No token → no socket
        if (!token) {
            cleanupSocket();
            console.log("no token: ")
            return;
        }


        //Prevent duplicate connections
        if (socketRef.current?.connected) {
            console.log("Socket already connected, skipping init...");
            return;
        }

        // console.log("getAccessToken: ", accessToken)

        // Create new socket connection
        const newSocket: Socket = io(backendUrl, {
            auth: {
                token: accessToken,
            },
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
        newSocket.on("online_users_updated", (users: IUser[]) => {
            if (Array.isArray(users)) {
                setOnlineUsers(users);
            }
        });

        // store and update state
        socketRef.current = newSocket;
        setSocket(newSocket);

        // Cleanup on unmount or token change
        return () => cleanupSocket();
    }, [user, accessToken, backendUrl, cleanupSocket]);

    // --- Emitters ---
    const sendMessage = useCallback((message: string, roomId: string) => {
        if (socketRef.current) {
            socketRef.current.emit("send_message", { message, roomId });
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
        disconnectSocket,
        reconnectSocket,
    };
};

export default useSocketHandler;
