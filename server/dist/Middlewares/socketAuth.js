"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const socketAuthMiddleware = (socket, next) => {
    var _a;
    const token = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token;
    //   const token = socket.handshake.headers.cookie
    //     ?.split("; ")
    //     .find((cookie) => cookie.startsWith("refreshToken="))
    //     ?.split("=")[1];
    if (!token) {
        console.log("Socket token not found in header");
        return next(new Error("No token provided"));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        socket.data.userId = decoded._id;
        socket.data.userName = decoded.userName;
        socket.data.userRole = decoded.role;
        next();
    }
    catch (err) {
        console.error("JWT verification failed:", err);
        next(new Error("Invalid or expired token"));
    }
};
exports.socketAuthMiddleware = socketAuthMiddleware;
