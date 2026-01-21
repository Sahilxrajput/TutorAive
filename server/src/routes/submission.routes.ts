import express from "express";
import {
  getSubmissions,
  getStudentSubmission,
  gradeSubmission,
  getSubmissionById,
  saveSubmission,
} from "../controllers/submission.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { isInstructor } from "../middlewares/Instructor.middleware";
import { upload } from "../lib/cloudinary";
import { cloudinarySignature } from "../controllers/assignment.controller";

const router = express.Router();

router.use(authMiddleware);

// @todo isEnrolled middleware

// upload signature
router.post(
  "/assignments/:assignmentId/cloudinary/signature",
  cloudinarySignature,
);

// submit assignment
router.post("/assignments/:assignmentId/save", saveSubmission);

// get my submission for an assignment
router.get("/assignments/:assignmentId/me", getStudentSubmission);

// get submission by id (student or teacher)
router.get("/:id", getSubmissionById);

/* -------------------- Instructor routes -------------------- */
router.use(isInstructor);

// get all submissions for an assignment
router.get("/assignments/:assignmentId", getSubmissions);

// grade a submission
router.put("/:id/grade", gradeSubmission);

export default router;
