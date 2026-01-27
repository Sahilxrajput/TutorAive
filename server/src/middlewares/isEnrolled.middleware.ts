// middlewares/isEnrolled.ts
import { Request, Response, NextFunction } from "express";
import {Classroom} from "../models/classroom.model";

export const isEnrolled = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const classroomId = req.params.classroomId || req.body.classroomId;
    if (!classroomId) {
      console.log("Classroom ID is required");
      return res.status(400).json({ message: "Classroom ID is required" });
    }

    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const classroom = await Classroom.findById(classroomId).select(
      "students createdBy"
    );

    if (!classroom) {
      console.log("Classroom not found");
      return res.status(404).json({ message: "Classroom not found" });
    }

    // Allow the creator as well
    const isOwner = classroom.teacher.toString() === userId!.toString();
    const isStudent = classroom.students.some(
      (_id: any) => _id.toString() === userId!.toString()
    );
    console.log("isStudent", isStudent);
    console.log("isOwner", isOwner);
    if (!isOwner && !isStudent) {
      console.log("You are not enrolled/instructor in this classroom");
      return res
        .status(403)
        .json({ message: "You are not enrolled/instructor in this classroom" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
