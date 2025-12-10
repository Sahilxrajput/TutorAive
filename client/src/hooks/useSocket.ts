import { SocketContext } from "@/context/socketContext";
import { useContext } from "react";

const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocketContext must be used inside a SocketProvider");
  }

  return context;
};

export default  useSocket;
