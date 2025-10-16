import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { MyJwtPayload } from "../types/type";

// Extend Request interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
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
  // Get token from cookies or Authorization header
  const token =
    req.cookies?.authToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "No token found, please log in." });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as MyJwtPayload;
    
    req.userId = decoded._id; // attach user ID to request
    req.userRole = decoded.role;
    next(); // user is authenticated, proceed
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
}
