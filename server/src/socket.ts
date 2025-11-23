import { Server, Socket } from "socket.io";
import {
  addUser,
  removeUser,
  ISocketUser,
  getOnlineUsers,
  getUserById,
  getUsersInRoom,
} from "./utils/users";
import { Server as HTTPServer } from "http";
import { socketAuthMiddleware } from "./Middlewares/socketAuth";

interface IMessage {
  userId: string;
  userName: string;
  message: string;
  roomId: string;
  timestamp: string;
}

const connections = new Map<string, Set<string>>(); // roomId -> set of socketIds
const timeOnline: { [socketId: string]: Date } = {};

export const initSocket = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket: Socket) => {
    console.log("Something Connected:", socket.id);

    // --- JOIN ROOM ---
    socket.on("join_room", (roomId: string) => {
      console.log("user joined room:", roomId);

      // ensure room entry exists
      if (!connections.has(roomId)) connections.set(roomId, new Set());
      connections.get(roomId)!.add(socket.id);
      timeOnline[socket.id] = new Date();

      // Add user to your app-level online list
      const newUser: ISocketUser = {
        userId: socket.data.userId,
        userName: socket.data.userName,
        roomId,
        socketId: socket.id,
      };
      addUser(newUser);

      // Actually join Socket.IO room
      socket.join(roomId);

      // Notify everyone in the room (including the new user if you want)
      io.in(roomId).emit("user_joined", { userId: socket.id });
      io.in(roomId).emit("online_users_updated", getUsersInRoom(roomId));
    });

    // --- LEAVE ROOM ---
    socket.on("leave_room", (roomId: string) => {
      console.log("user left:", roomId);

      // leave Socket.IO room
      socket.leave(roomId);

      // cleanup our map
      const set = connections.get(roomId);
      if (set) {
        set.delete(socket.id);
        if (set.size === 0) connections.delete(roomId);
      }

      removeUser(socket.id); // keep your app-level list consistent

      io.in(roomId).emit("user_left", { userId: socket.id });
      io.in(roomId).emit("online_users_updated", getUsersInRoom(roomId));
      delete timeOnline[socket.id];
    });

    // --- DISCONNECT (global socket disconnect) ---
    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id} (${reason})`);

      // compute time online if present
      if (timeOnline[socket.id]) {
        const durationMs = Date.now() - timeOnline[socket.id].getTime();
        console.log(`Socket ${socket.id} was online for ${durationMs} ms`);
        delete timeOnline[socket.id];
      }

      // remove from all room sets and notify each room
      for (const [roomId, set] of connections.entries()) {
        if (set.has(socket.id)) {
          set.delete(socket.id);
          io.in(roomId).emit("user_left", { userId: socket.id });
          io.in(roomId).emit("online_users_updated", getUsersInRoom(roomId));
          if (set.size === 0) connections.delete(roomId);
        }
      }

      removeUser(socket.id); // remove from app-level online list
    });

    // --- SIGNALING EVENTS ---
    socket.on("offer", (data: { to: string; sdp: any }) => {
      socket.to(data.to).emit("offer", { sdp: data.sdp, from: socket.id });
    });

    socket.on("answer", (data: { to: string; sdp: any }) => {
      socket.to(data.to).emit("answer", { sdp: data.sdp, from: socket.id });
    });

    socket.on("ice-candidate", (data: { to: string; candidate: any }) => {
      socket.to(data.to).emit("ice-candidate", {
        candidate: data.candidate,
        from: socket.id,
      });
    });

    // --- MESSAGING ---
    socket.on("send_message", (data: { message: string; roomId: string }) => {
      const sender = getUserById(socket.data.userId);
      if (!sender) {
        console.warn("Sender not found or offline");
        return;
      }

      const payload: IMessage = {
        userId: sender.userId,
        userName: sender.userName || "Anonymous",
        message: data.message,
        roomId: data.roomId,
        timestamp: new Date().toISOString(),
      };

      console.log("rec msg", payload);

      io.in(data.roomId).emit("receive_message", payload);
    });

    // ! @todo lecture update
    socket.on("lecture_update", (data: any) => {
      const sender = getUserById(socket.data.userId);
      if (!sender) {
        console.warn("Sender not found or offline");
        return;
      }

      io.in(data.roomId).emit("receive_message");
    });

    socket.on("connect_error", (err: any) => {
      console.error("Socket connection error:", err.message);
    });

    socket.on("reconnect_attempt", (attempt: number) => {
      console.log(`Reconnection attempt ${attempt}...`);
    });

    socket.on("reconnect", (attempt: number) => {
      console.log(`Reconnected after ${attempt} attempts`);
    });
  });

  return io;
};
