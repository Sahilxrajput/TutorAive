import { Request, Response } from "express";
import Submission from "../models/submission.model";

// Submit assignment
export const submitAssignment = async (req: Request, res: Response) => {
  try {
    const { assignmentId, fileUrl, content } = req.body;

    const existing = await Submission.findOne({
      assignment: assignmentId,
      student: req.userId,
    });

    if (existing) return res.status(400).json({ message: "Already submitted" });

    const submission = await Submission.create({
      assignment: assignmentId,
      student: req.userId,
      fileUrl,
      content,
    });

    res.status(201).json(submission);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get submissions for a specific assignment (instructor)
export const getSubmissions = async (req: Request, res: Response) => {
  try {
    const submissions = await Submission.find({ assignment: req.params.assignmentId })
      .populate("student", "username email")
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get student's submission for a specific assignment
export const getStudentSubmission = async (req: Request, res: Response) => {
  try {
    const submission = await Submission.findOne({
      assignment: req.params.assignmentId,
      student: req.userId,
    });

    if (!submission) return res.status(404).json({ message: "No submission found" });
    res.json(submission);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Grade a submission (instructor)
export const gradeSubmission = async (req: Request, res: Response) => {
  try {
    const { grade, feedback } = req.body;

    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { grade, feedback },
      { new: true }
    );

    if (!submission) return res.status(404).json({ message: "Submission not found" });

    res.json(submission);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
