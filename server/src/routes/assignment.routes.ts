import express from "express";
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  deleteAssignment,
} from "../controllers/assignment.controller";
import authMiddleware from "../Middlewares/authMiddleware";
import isInstructor from "../Middlewares/isInstructor";

const assignmentRoutes = express.Router();

assignmentRoutes.use(authMiddleware);

/* -------------------- Students + Instructors -------------------- */
assignmentRoutes.get("/classroom/:classroomId", getAssignments);
assignmentRoutes.get("/:id", getAssignmentById);

/* ------------------------ Instructors Only ---------------------- */
assignmentRoutes.use(isInstructor);
assignmentRoutes.post("/", createAssignment);
assignmentRoutes.delete("/:id", deleteAssignment);

export default assignmentRoutes ;

