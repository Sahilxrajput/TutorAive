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
import {
  createLecture,
  updateLecture,
} from "../controllers/lecture.controller";
import { getAllEnrolledClassrooms } from "../controllers/user.controller";
import {
  createLectureValidator,
  updateLectureValidator,
} from "../validators/lecture.validtor";

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

// Update classroom
router.put("/:id", updateClassroomValidator, handleValidation, updateClassroom);

// Archive classroom
router.put(
  "/:id/archive",
  idParamValidator,
  handleValidation,
  archiveClassroom
);

//!@check create a --------------------lecture------------------------ in classroom
router
  .route("/:classroomId/lectures")
  .post(createLectureValidator, handleValidation, createLecture);

router
  .route("/:classroomId/lectures/:id")
  .put(updateLectureValidator, handleValidation, updateLecture)
  .delete(idParamValidator, handleValidation, deleteClassroom)

export default router;
