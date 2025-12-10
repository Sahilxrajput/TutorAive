import { createContext } from "react";
import type { ISocketContextValue } from "../types/type";


export const SocketContext = createContext<ISocketContextValue | undefined>(undefined);

