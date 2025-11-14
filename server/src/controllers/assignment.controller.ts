import { Request, Response } from "express";
import Assignment from "../models/assignment.model";
import Classroom from "../models/classroom.model";
import { IAssignment } from "../types/type";

// Create new assignment
export const createAssignment = async (req: Request, res: Response) => {
  try {
    const { title, description, dueDate, maxPoints, attachment } = req.body;
    const classroomId = req.params.classroomId;

    const assignment = await Assignment.create({
      classroom: classroomId,
      title,
      description,
      dueDate,
      createdBy: req.userId,
      maxPoints,
    });

    res.status(201).json(assignment);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Error creating assignment", error: err.message });
  }
};

export const getAssignments = async (req: Request, res: Response) => {
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

    res.json({
      totalAssignments: assignments.length,
      assignments,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error while fetching assignments." });
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
export const getAssignmentByClassroomId = async (
  req: Request,
  res: Response
) => {
  try {
    const assignments = await Assignment.find({
      classroom: req.params.classroomId,
    });
    if (!assignments)
      return res.status(404).json({ message: "Assignment not found" });
    res.json(assignments);
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
