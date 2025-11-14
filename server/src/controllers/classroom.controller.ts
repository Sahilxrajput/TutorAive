import { Request, Response } from "express";
import Classroom from "../models/classroom.model";
import ClassSchedule from "../models/lecture.model";
import User from "../models/user.model";

// Create a new classroom
export const createClassroom = async (req: Request, res: Response) => {
  try {
    const classroom = await Classroom.create({
      ...req.body,
      createdBy: req.userId,
    });
    res.status(201).json(classroom);
  } catch (error) {
    res.status(400).json({ message: "Failed to create classroom", error });
  }
};

// @todo
// Get all classrooms (with optional filtering)
export const getClassrooms = async (req: Request, res: Response) => {
  try {
    const { status, isPublic } = req.query;
    const filter: Record<string, any> = {};
    if (status) filter.status = status;
    if (isPublic !== undefined) filter.isPublic = isPublic === "true";

    const classrooms = await Classroom.find(filter)
    //? @fix think about populated fields
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

      res
      .status(200)
      .json({ message: "fetch classrooms successfully", data: classrooms });
  } catch (error) {
    res.status(500).json({ message: "Error fetching classrooms", error });
  }
};

// Get a single classroom by ID
export const getClassroomById = async (req: Request, res: Response) => {
  try {
    const classroom = await Classroom.findById(req.params.id)
      .populate("createdBy", "name email profilePicture")
      .populate("students", "name email profilePicture");
    if (!classroom)
      return res.status(404).json({ message: "Classroom not found" });
    res.json(classroom);
  } catch (error) {
    res.status(500).json({ message: "Error fetching classroom", error });
  }
};

// Update classroom details
export const updateClassroom = async (req: Request, res: Response) => {
  try {
    const updated = await Classroom.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Classroom not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Failed to update classroom", error });
  }
};

//@todo permanent delete
// Delete (soft-delete or permanently remove)
export const deleteClassroom = async (req: Request, res: Response) => {
  try {
    const classroom = await Classroom.findByIdAndUpdate(
      req.params.id,
      { status: "deleted" },
      { new: true }
    );
    if (!classroom)
      return res.status(404).json({ message: "Classroom not found" });
    res.json({ message: "Classroom deleted", classroom });
  } catch (error) {
    res.status(500).json({ message: "Error deleting classroom", error });
  }
};

// Join a classroom using joinCode
export const enrollClassroomByCode = async (req: Request, res: Response) => {
  try {
    const { joinCode } = req.body;
    const classroom = await Classroom.findOne({ joinCode });
    if (!classroom)
      return res.status(404).json({ message: "Invalid join code" });

    if (!classroom.students.includes(req.userId)) {
      classroom.students.push(req.userId);
      await classroom.save();
    }
    res.json({ message: "Joined classroom successfully", classroom });
  } catch (error) {
    res.status(500).json({ message: "Error joining classroom", error });
  }
};

export const enrollClassroom = async (req: Request, res: Response) => {
  try {
    const { classroomId } = req.body;
    const userId = req.userId; // ensure this is populated by auth middleware

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Enroll user if not already enrolled
    if (!classroom.students.includes(userId)) {
      console.log("classroom update");
      classroom.students.push(userId);
      await classroom.save();
    }

    // Update user's enrolledCourses
    if (!user.enrolledClassrooms.includes(classroomId)) {
      console.log("user update");
      user.enrolledClassrooms.push(classroomId);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Enrolled in classroom successfully",
      classroom,
    });
  } catch (error) {
    console.error("Error enrolling classroom:", error);
    res.status(500).json({
      success: false,
      message: "Error enrolling in classroom",
      error: (error as Error).message,
    });
  }
};

// Archive a classroom
export const archiveClassroom = async (req: Request, res: Response) => {
  try {
    const classroom = await Classroom.findByIdAndUpdate(
      req.params.id,
      { status: "archived" },
      { new: true }
    );
    if (!classroom)
      return res.status(404).json({ message: "Classroom not found" });
    res.json({ message: "Classroom archived", classroom });
  } catch (error) {
    res.status(500).json({ message: "Error archiving classroom", error });
  }
};
