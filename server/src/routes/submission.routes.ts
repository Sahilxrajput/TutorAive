import express from "express";
import {
  submitAssignment,
  getSubmissions,
  getStudentSubmission,
  gradeSubmission,
} from "../controllers/submission.controller";
import authMiddleware from "../Middlewares/auth.middleware";
import {isInstructor} from "../Middlewares/Instructor.middleware";

const router = express.Router();

router.use(authMiddleware);

/* ---------------------- Students ---------------------- */
router.post("/", submitAssignment);
router.get("/assignment/:assignmentId/mine", getStudentSubmission);

/* -------------------- Instructors --------------------- */
router.use(isInstructor);
router.get("/assignment/:assignmentId", getSubmissions);
router.put("/:id/grade", gradeSubmission);

export default router;
