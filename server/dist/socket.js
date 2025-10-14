"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_1 = require("./utils/users");
//  Initializes Socket.IO with JWT authentication and event handlers.
const initSocket = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL, // your frontend URL
            credentials: true,
        },
    });
    // Shared auth middleware
    const authMiddleware = (socket, next) => {
        var _a;
        const cookieHeader = socket.handshake.headers.cookie;
        const token = (_a = cookieHeader === null || cookieHeader === void 0 ? void 0 : cookieHeader.split("; ").find((row) => row.startsWith("accessToken="))) === null || _a === void 0 ? void 0 : _a.split("=")[1];
        if (!token) {
            console.log("token not found in cookie: ");
            return next(new Error("No token provided"));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            socket.data.userId = decoded._id;
            socket.data.username = decoded.email;
            next();
        }
        catch (err) {
            console.error("JWT verification failed:", err);
            next(new Error("Invalid or expired token"));
        }
    };
    io.use(authMiddleware);
    io.on("connection", (socket) => {
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
        (0, users_1.addUser)(socket.data.userId, socket.id, socket.data.username);
        io.emit("online_users_updated", (0, users_1.getOnlineUsers)());
        // --- Connection Events ---
        socket.on("disconnect", (reason) => {
            console.warn(`Chat disconnected: ${socket.data.userId} (${reason})`);
            (0, users_1.removeUser)(socket.id);
            io.emit("online_users_updated", (0, users_1.getOnlineUsers)());
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
        socket.on("send_message", (data) => {
            console.log("data : ", data);
            const sender = (0, users_1.getUserById)(socket.data.userId);
            console.log("online users : ", (0, users_1.getOnlineUsers)());
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
exports.initSocket = initSocket;
