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
import { uploadPdf } from "../Middlewares/pdfUpload";


const router = express.Router();

router.use(authMiddleware);

/* ---------------------- Students ---------------------- */
router.post(
  "/upload/:assignmentId",
  uploadPdf.single("document"),
  createSubmission
);

/* -------------------- General access --------------------- */
router.get("/:assignmentId", getStudentSubmission);
router.get("/:id", getSubmissionById);

/* -------------------- Instructors --------------------- */
router.use(isInstructor);
router.get("/assignment/:assignmentId", getSubmissions);
router.put("/grade/:id", gradeSubmission);

export default router;
