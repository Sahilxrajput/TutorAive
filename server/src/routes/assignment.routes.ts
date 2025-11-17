import express from "express";
import {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  getAssignmentsByClassroomId,
  updateAssignment,
  deleteAssignment,
} from "../controllers/assignment.controller";
import authMiddleware from "../Middlewares/auth.middleware";
import {
  isClassroomCreator,
  isInstructor,
} from "../Middlewares/Instructor.middleware";
import { upload } from "../lib/cloudinary";
import { isEnrolled } from "../Middlewares/isEnrolled.middleware";

const router = express.Router();

// Require auth for all assignment routes
router.use(authMiddleware);
// router.use(authMiddleware, isEnrolled);//!@todo isEnrolled also check user logedin or not

// Enrolled actions
router.get("/", getAllAssignments);
router.get("/classroom/:id/student/:userId", getAllAssignments); //@remind
router.get("/classroom/:classroomId", getAssignmentsByClassroomId);
router.get("/:id", getAssignmentById);

// Instructor-only routes
router.use(isInstructor);

// Instructor-only actions
router.post(
  "/upload/:classroomId",
  upload.single("assignmentFile"),
  createAssignment
);
router.put("/:id", isClassroomCreator, updateAssignment);
router.delete("/:id", isClassroomCreator, deleteAssignment);

export default router;
