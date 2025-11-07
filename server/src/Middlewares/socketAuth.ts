import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { MyJwtPayload } from "../types/type";

export const socketAuthMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  const cookieHeader = socket.handshake.headers.cookie;
  const token = cookieHeader
    ?.split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
  console.log("socket token found in cookie: ");
  if (!token) {
    console.log("socket token not found in cookie: ");
    return next(new Error("No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as MyJwtPayload;
    socket.data.userId = decoded._id;
    socket.data.username = decoded.email;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    next(new Error("Invalid or expired token"));
  }
};
