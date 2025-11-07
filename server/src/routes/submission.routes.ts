import express from "express";
import {
  createSubmission,
  getSubmissions,
  getStudentSubmission,
  gradeSubmission,
  getSubmissionById,
} from "../controllers/submission.controller";
import authMiddleware from "../Middlewares/auth.middleware";
import { isInstructor } from "../Middlewares/Instructor.middleware";

const router = express.Router();

router.use(authMiddleware);

/* ---------------------- Students ---------------------- */
router.post("/", createSubmission);

/* -------------------- General access --------------------- */
router.get("/:assignmentId", getStudentSubmission);
router.get("/:id", getSubmissionById);

/* -------------------- Instructors --------------------- */
router.use(isInstructor);
router.get("/:assignmentId", getSubmissions);
router.put("/:id/grade", gradeSubmission);

export default router;
