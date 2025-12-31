import express from "express";
import {
  createClassroom,
  getClassrooms,
  getClassroomById,
  updateClassroom,
  deleteClassroom,
  archiveClassroom,
  enrollClassroom,
  enrollClassroomByCode,
} from "../controllers/classroom.controller";
import {
  createClassroomValidator,
  updateClassroomValidator,
  joinClassroomValidator,
  idParamValidator,
  createClassScheduleValidator,
  joinClassroomByCodeValidator,
} from "../validators/classroom.validator";

import authMiddleware from "../Middlewares/auth.middleware";
import { handleValidation } from "../Middlewares/handleValidation";
import { isInstructor } from "../Middlewares/Instructor.middleware";
import { createLecture } from "../controllers/lecture.controller";
import { getAllEnrolledClassrooms } from "../controllers/user.controller";

const router = express.Router();

// Get all classrooms
router.get("/", getClassrooms);

// Get all enrolledclassrooms

router.use(authMiddleware); // all routes require auth
router.get("/enrolled", getAllEnrolledClassrooms);

// Get classroom by ID
router.get("/:id", idParamValidator, handleValidation, getClassroomById);

// Join classroom by code
router.post(
  "/:id/join",
  joinClassroomByCodeValidator,
  handleValidation,
  enrollClassroomByCode
);

//@todo enroll classroom by purchase
router.post(
  "/enroll",
  joinClassroomValidator,
  handleValidation,
  enrollClassroom
);

// isInstructor?
router.use(isInstructor);

// Create a new classroom
router.post("/", createClassroomValidator, handleValidation, createClassroom);

//!@check create a --------------------lecture------------------------ in classroom 
router.route("/:classroomId/lectures").post(createLecture).get(deleteClassroom);

// Update classroom
router.put("/:id", updateClassroomValidator, handleValidation, updateClassroom);

// Delete classroom
router.delete("/:id", idParamValidator, handleValidation, deleteClassroom);

// Archive classroom
router.put(
  "/:id/archive",
  idParamValidator,
  handleValidation,
  archiveClassroom
);

export default router;
