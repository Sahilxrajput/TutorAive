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
} from "../validators/classroom.schema";

import authMiddleware from "../Middlewares/auth.middleware";
import { handleValidation } from "../Middlewares/validate";
import {isInstructor} from "../Middlewares/Instructor.middleware";

const router = express.Router();

// Get all classrooms
router.get("/", getClassrooms);

router.use(authMiddleware); // all routes require auth

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
