import { Request, Response, NextFunction } from "express";
import Classroom from "../models/classroom.model";
import { IClassroom } from "../types/type";

declare global {
  namespace Express {
    interface Request {
      classroom?: IClassroom;
    }
  }
}

export const isInstructor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.userRole !== "instructor") {
      return res
        .status(403)
        .json({ message: "Access denied. Instructors only." });
    }

    next();
  } catch (error) {
    console.error("isInstructor middleware error:", error);
    return res
      .status(500)
      .json({ message: "Server error verifying instructor role." });
  }
};


