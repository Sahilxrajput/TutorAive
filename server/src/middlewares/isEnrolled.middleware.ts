import { Request, Response, NextFunction } from "express";
import { Classroom } from "../models/classroom.model";
import { Types } from "mongoose";

export const isEnrolled = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const classroomId = req.params.classroomId || req.body.classroomId;
    if (!classroomId) {
      return res.status(400).json({ message: "Classroom ID is required" });
    }

    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const classroom =
      await Classroom.findById(classroomId).select("students teacher");

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

     const isEnrolled = classroom.students.some(
       (_id: Types.ObjectId) => _id.toString() === userId!.toString(),
     );

    // Allow the creator as well
    const isClassroomInstructor =
      classroom.teacher?.toString() === userId!.toString();


     if (!isEnrolled && !isClassroomInstructor)
       return res.status(403).json({
         message:
           "Access denied. Only enrolled students or instructors can access this classroom.",
       });

    req.authorizedResource = classroom;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
