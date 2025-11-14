import express from "express";
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  getAssignmentByClassroomId,
  updateAssignment,
  deleteAssignment,
} from "../controllers/assignment.controller";
import authMiddleware from "../Middlewares/auth.middleware";
import {
  isClassroomCreator,
  isInstructor,
} from "../Middlewares/Instructor.middleware";

const router = express.Router();

// Require auth for all assignment routes
router.use(authMiddleware);

// Public for authenticated users (students + instructors)
router.get("/", getAssignments);
router.get("/:classroomId", getAssignmentByClassroomId);
router.get("/:id", getAssignmentById);

// Instructor-only routes
router.use(isInstructor);

// Instructor-only actions
router.post("/", createAssignment);
router.put("/:id", isClassroomCreator, updateAssignment);
router.delete("/:id", isClassroomCreator, deleteAssignment);

export default router;



