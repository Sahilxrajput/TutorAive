import { Request, Response } from "express";
import Submission from "../models/submission.model";
import Assignment from "../models/assignment.model";

// Save assignment
export const saveSubmission = async (req: Request, res: Response) => {
  try {
    const { pdfUrl, public_id, resource_type } = req.body;

    const { assignmentId } = req.params;

    if (!resource_type || !pdfUrl || !public_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const submission = await Submission.create({
      student: req.userId,
      assignment: assignmentId,
      file: {
        url: pdfUrl,
        public_id,
        resource_type,
      },
      status: "submitted",
    });

    console.log("submission : ", submission);

    return res.status(201).json({
      success: true,
      message: "Submission done successfully",
      data: submission,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({
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
      .populate("student", "userName email")
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// get submission by id
export const getSubmissionById = async (req: Request, res: Response) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("student", "userName email")
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

    const submission = await Submission.findById(req.params.id).populate(
      "assignmentId"
    );

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    const assignmentCreatorId = submission.assignmentId.createdBy.toString();

    if (assignmentCreatorId !== req.userId) {
      return res.status(403).json({
        message: "Unauthorized: Only the assignment creator can grade this.",
      });
    }

    submission.marks = marks;
    submission.feedback = feedback;
    submission.status = "graded";

    //@todo send a msg after grade the submission
    await submission.save();

    return res.status(200).json({ message: "Graded successfully", submission });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
