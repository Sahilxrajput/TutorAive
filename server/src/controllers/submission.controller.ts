import { Request, Response } from "express";
import Submission from "../models/submission.model";
import mongoose from "mongoose";
import Assignment from "../models/assignment.model";

// Submit assignment
export const createSubmission = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required." });
    }

    const { assignmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({ message: "Invalid assignment ID" });
    }
    // @todo all validator not enrolled user can't ablee to upload submission
    const existing = await Submission.findOne({
      assignment: assignmentId,
      student: req.userId,
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "You have already submitted this assignment" });
    }

    const submission = await Submission.create({
      assignment: assignmentId,
      student: req.userId,
      fileUrl: req.file?.path || "path",
      status: "submitted",
    });

    await Assignment.findByIdAndUpdate(assignmentId, {
      $push: { submissions: submission._id },
    });


    res.status(201).json({
      success: true,
      message: "Submission uploaded successfully",
      submission,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Server error uploading submission",
      error: (err as Error).message,
    });
  }
};

// Get submissions for a specific assignment (instructor)
export const getSubmissions = async (req: Request, res: Response) => {
  try {
    const submissions = await Submission.find({
      assignment: req.params.assignmentId,
    })
      .populate("student", "username email")
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getSubmissionById = async (req: Request, res: Response) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("student", "username email")
      .populate("assignment", "title dueDate");
    if (
      submission.student._id.toString() !== req.userId?.toString() ||
      req.userRole !== "instructor"
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this submission." });
    }
    res.status(200).json({ success: true, data: submission });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: err.message || "Server error fetching submission" });
  }
};

// Get student's submission for a specific assignment
export const getStudentSubmission = async (req: Request, res: Response) => {
  try {
    const submission = await Submission.findOne({
      assignment: req.params.assignmentId,
      student: req.userId,
    });

    if (!submission)
      return res.status(404).json({ message: "No submission found" });
    res.json(submission);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Grade a submission (instructor)
export const gradeSubmission = async (req: Request, res: Response) => {
  try {
    const { marks, feedback } = req.body;

    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { marks, feedback },
      { new: true }
    );

    if (!submission)
      return res.status(404).json({ message: "Submission not found" });

    res.json(submission);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
