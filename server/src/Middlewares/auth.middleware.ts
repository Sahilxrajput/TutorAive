import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { MyJwtPayload } from "../types/type";

// Extend Request interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userName?: string;
      userRole?: "student" | "instructor" | "admin";
    }
  }
}

// Authentication middleware
export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];
  console.log("token exist: ")
  // Get token from cookies or Authorization header
  //   const token =
  //     req.cookies?.accessToken ||
  //     req.header("Authorization")?.replace("Bearer ", "");
  //   if (!token) {
  //     return res.status(401).json({ error: "No token found, please log in." });
  //   }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as MyJwtPayload;
    req.userId = decoded._id;
    req.userRole = decoded.role;
    req.userName = decoded.userName;

    next();
  } catch (err) {
    return res.status(403).json({ error: "Access token expired." });
  }
}
