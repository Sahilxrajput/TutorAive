import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { MyJwtPayload } from "../types/type";

export const socketAuthMiddleware = (
  socket: Socket,
  next: (err?: Error) => void
) => {
    const token = socket.handshake.auth?.token;
    
//   const token = socket.handshake.headers.cookie
//     ?.split("; ")
//     .find((cookie) => cookie.startsWith("refreshToken="))
//     ?.split("=")[1];

  if (!token) {
    console.log("Socket token not found in header");
    return next(new Error("No token provided"));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as MyJwtPayload;

    socket.data.userId = decoded._id;
    socket.data.userName = decoded.userName;
    socket.data.userRole = decoded.role;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    next(new Error("Invalid or expired token"));
  }
};
