import { Request, Response } from "express";
import Assignment from "../models/assignment.model";
import Classroom from "../models/classroom.model";
import mongoose from "mongoose";
import Submission from "../models/submission.model";
import { ISubmission } from "../types/type";

// Create new assignment
export const createAssignment = async (req: Request, res: Response) => {
  try {
    const classroomId = req.params.classroomId;
    const { title, description, dueDate, maxPoints } = req.body;

    if (!mongoose.Types.ObjectId.isValid(classroomId)) {
      console.log("invalid id");
      return res.status(400).json({ message: "Invalid classroom ID" });
    }

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    if (classroom.createdBy.toString() !== req.userId?.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const assignment = await Assignment.create({
      classroom: classroomId,
      title,
      description,
      dueDate,
      createdBy: req.userId,
      maxPoints,
      attachment: req.file ? req.file.path : null, // optional file,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: assignment,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Error creating assignment",
      error: err.message,
    });
  }
};

export const getAllAssignments = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    // Find classrooms where the user is a member
    const classrooms = await Classroom.find({ students: userId }).select("_id");

    if (!classrooms.length)
      return res.status(404).json({ message: "User is not in any classroom." });

    // console.log("classrooms :" + classrooms);

    const classroomIds = classrooms.map((c) => c._id);
    // console.log("classrooms :" + classrooms);

    // Fetch assignments for all those classrooms
    const assignments = await Assignment.find({
      classroom: { $in: classroomIds },
    })
      // .populate("classroom", "name code") // optional //? @todo
      .sort({ dueDate: 1 });

    // console.log("assignments :" + assignments);

    res.status(200).json({
      totalAssignments: assignments.length,
      data: assignments,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error while fetching assignments." });
  }
};

// @remind
export const getStudentAssignmentsForClassroom = async (req:Request, res:Response) => {
  try {
    const { classroomId, studentId } = req.params;

    // 1. Get all assignments for the classroom
    const assignments = await Assignment.find({ classroom: classroomId });

    // 2. Get all submissions by this student for this classroom
    const submissions = await Submission.find({ student: studentId });

    // Convert submitted assignment IDs into a Set for fast lookup
    const submittedIds = new Set(
      submissions.map((s:ISubmission) => s.assignment.toString())
    );

    // 3. Split into pending + submitted
    const submitted = assignments.filter((a) =>
      submittedIds.has(a._id.toString())
    );

    const pending = assignments.filter(
      (a) => !submittedIds.has(a._id.toString())
    );

    res.status(200).json({
      success: true,
      submitted,
      pending,
    });
  } catch (err:any) {
    res.status(500).json({ success: false, message: err?.message });
  }
};

// Get single assignment
export const getAssignmentById = async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });
    res.json({ success: true, data: assignment });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//get all assignment of a classroom
export const getAssignmentsByClassroomId = async (
  req: Request,
  res: Response
) => {
  try {
    const assignments = await Assignment.find({
      classroom: req.params.classroomId,
    });

    if (!assignments)
      return res.status(404).json({ message: "Assignment not found" });
    
    res.status(200).json({ data: assignments, success: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Delete assignment (instructor only)
//! @fix update userrole
export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    await assignment.deleteOne();
    res.json({ message: "Assignment deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateAssignment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id; // or whatever your auth middleware attaches

    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const updated = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: (error as Error).message,
    });
  }
};
