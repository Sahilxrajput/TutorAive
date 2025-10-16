import { Request, Response } from "express";
import Assignment from "../models/assignment.model";

// Create new assignment
export const createAssignment = async (req: Request, res: Response) => {
  try {
    const { classroomId, title, description, dueDate, maxPoints } = req.body;

    const assignment = await Assignment.create({
      classroom: classroomId,
      title,
      description,
      dueDate,
      createdBy: req.userId,
      maxPoints
    });

    res.status(201).json(assignment);
  } catch (err: any) {
    res.status(500).json({ message: "Error creating assignment", error: err.message });
  }
};

// Get all assignments for a classroom
export const getAssignments = async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find({ classroom: req.params.classroomId })
      .populate("createdBy", "username")
      .sort({ dueDate: 1 });
    res.json(assignments);
  } catch (err: any) {
    res.status(500).json({ message: "Error fetching assignments", error: err.message });
  }
};

// Get single assignment
export const getAssignmentById = async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    res.json(assignment);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Delete assignment (instructor only)
export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    if (assignment.createdBy.toString() !== req.userId && req.userRole !== "admin")
      return res.status(403).json({ message: "Not authorized" });

    await assignment.deleteOne();
    res.json({ message: "Assignment deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
