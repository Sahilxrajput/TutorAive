import React from "react";
import useSocketHandler from "../hooks/useSocketHandler";
import type { IUser } from "../types/type";
import { SocketContext } from "@/context/socketContext";

export const SocketProvider: React.FC<{ user?: IUser; children: React.ReactNode }> = ({ user, children }) => {
    const socketData = useSocketHandler(user);

    return (
        <SocketContext.Provider value={socketData}>
            {children}
        </SocketContext.Provider>
    );
}