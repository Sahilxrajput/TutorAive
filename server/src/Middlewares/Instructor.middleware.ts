import { Request, Response, NextFunction } from "express";
import Classroom from "../models/classroom.model";

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

export const isClassroomCreator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const classroomId = req.params.classroomId || req.body.classroomId;

    if (!classroomId) {
      return res.status(400).json({ message: "Classroom ID is required" });
    }

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    if (classroom.createdBy.toString() !== req.userId!.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to modify this classroom" });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: (error as Error).message,
    });
  }
};
