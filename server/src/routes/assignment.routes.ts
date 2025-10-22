import express from "express";
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  deleteAssignment,
} from "../controllers/assignment.controller";
import authMiddleware from "../Middlewares/authMiddleware";
import isInstructor from "../Middlewares/isInstructor";

const router = express.Router();

router.use(authMiddleware);

/* -------------------- Students + Instructors -------------------- */
router.get("/classroom/:classroomId", getAssignments);
router.get("/:id", getAssignmentById);

/* ------------------------ Instructors Only ---------------------- */
router.use(isInstructor);
router.post("/", createAssignment);
router.delete("/:id", deleteAssignment);

export default router ;

