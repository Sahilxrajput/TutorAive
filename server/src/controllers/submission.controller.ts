import { Request, Response } from "express";
import Submission from "../models/submission.model";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../lib/cloudinary";

// Submit assignment
export const createSubmission = async (
  // req: Request & {
  //   file?: Express.Multer.File;
  //   userId?: string;
  //   userRole?: string;
  // },
  req: Request,
  res: Response
) => {
  try {
    if (!req.file) {
      console.log("file is required");
      return res.status(400).json({ message: "PDF file is required." });
    }

    const assignmentId = req.params.assignmentId;
    console.log("assignment Id", assignmentId);

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      console.log("invalid id");
      return res.status(400).json({ message: "Invalid assignment ID" });
    }

    const existing = await Submission.findOne({
      assignment: assignmentId,
      student: req.userId,
    });

    if (existing) {
      console.log("You have already submitted this assignment");
      return res
        .status(400)
        .json({ message: "You have already submitted this assignment" });
    }

    // const pdf = await uploadOnCloudinary(req.file.path);
    // console.log("pdf", pdf);
    const submission = await Submission.create({
      assignment: assignmentId,
      student: req.userId,
      fileUrl: req.file?.path || "path",
      status: "submitted",
    });
    console.log("submission", submission);
    res.status(201).json({
      success: true,
      message: "Submission uploaded successfully",
      submission,
    });
  } catch (err: any) {
    console.log("err :", err);
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
