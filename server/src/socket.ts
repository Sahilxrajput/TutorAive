import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import {
  addUser,
  removeUser,
  getOnlineUsers,
  getUserById,
} from "./utils/users";
import { MyJwtPayload } from "./types/type";
import http, { Server as HTTPServer } from "http";

//  Initializes Socket.IO with JWT authentication and event handlers.

export const initSocket = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL, // your frontend URL
      credentials: true,
    },
  });

  // Shared auth middleware
  const authMiddleware = (socket: Socket, next: (err?: Error) => void) => {
    const cookieHeader = socket.handshake.headers.cookie;
    const token = cookieHeader
      ?.split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
    if (!token) {
      console.log("token not found in cookie: ");
      return next(new Error("No token provided"));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as MyJwtPayload;
      socket.data.userId = decoded._id;
      socket.data.username = decoded.email;
      next();
    } catch (err) {
      console.error("JWT verification failed:", err);
      next(new Error("Invalid or expired token"));
    }
  };

  io.use(authMiddleware);

  io.on("connection", (socket: Socket) => {
    console.log(`💬 Chat connected: ${socket.data.userId} (${socket.id})`);

    // Join a room
    socket.on("join_room", (roomId) => {
      console.log("user joined room : ", roomId);
      socket.join(roomId); // actually join the room
      socket.to(roomId).emit("user_joined", { userId: socket.id }); // notify others
      // socket.emit("joined_room", { roomId }); // optional: confirm to the user
    });

    // Leave a room
    socket.on("leave_room", (roomId) => {
      console.log("user left :", roomId);
      socket.leave(roomId); // actually leave the room
      socket.to(roomId).emit("user_left", { userId: socket.id }); // notify others
      socket.to(roomId).emit("user_left", { userId: socket.id }); // notify others
    });

    // Add user to online list
    addUser(socket.data.userId, socket.id, socket.data.username);
    io.emit("online_users_updated", getOnlineUsers());

    // --- Connection Events ---
    socket.on("disconnect", (reason) => {
      console.warn(`Chat disconnected: ${socket.data.userId} (${reason})`);
      removeUser(socket.id);
      io.emit("online_users_updated", getOnlineUsers());
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    socket.on("reconnect_attempt", (attempt) => {
      console.log(`Reconnection attempt ${attempt}...`);
    });

    socket.on("reconnect", (attempt) => {
      console.log(`Reconnected after ${attempt} attempts`);
    });

    // --- Custom Chat Event ---
    socket.on("send_message", (data: { message: string; roomId: string }) => {
      console.log("data : ", data);
      const sender = getUserById(socket.data.userId);

      console.log("online users : ", getOnlineUsers());

      if (!sender) {
        console.warn("Sender not found or offline");
        return;
      }

      const payload = {
        userId: sender.userId,
        username: sender.username || "Anonymous",
        message: data.message,
        timestamp: new Date().toISOString(),
      };

      console.log("Message received:", payload);
      io.to(data.roomId).emit("receive_message", payload);
    });
  });

  return io;
};
