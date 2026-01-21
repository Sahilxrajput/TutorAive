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

import authMiddleware from "../middlewares/auth.middleware";
import { handleValidation } from "../middlewares/handleValidation";
import { isInstructor } from "../middlewares/Instructor.middleware";
import {
  createLecture,
  updateLecture,
} from "../controllers/lecture.controller";
import { getAllEnrolledClassrooms } from "../controllers/user.controller";
import {
  createLectureValidator,
  updateLectureValidator,
} from "../validators/lecture.validtor";
import { isEnrolled } from "../middlewares/isEnrolled.middleware";
import {
  getStudentAssignmentProgress,
  getMyAssignmentProgress,
} from "../controllers/assignment.controller";
import { authorizeOwnerMiddleware } from "../middlewares/authorizeOwner.middleware";

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
  enrollClassroomByCode,
);

//@todo enroll classroom by purchase
router.post(
  "/enroll",
  joinClassroomValidator,
  handleValidation,
  enrollClassroom,
);

//!@check create a --------------------lecture/Assignmnet------------------------ in classroom
//get classroom assignments of student pending  + submitted
router.get(
  "/:classroomId/my-assignment-progress",
  isEnrolled, // techer / enrolled student -> true
  getMyAssignmentProgress,
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
  archiveClassroom,
);

//!@check create a --------------------lecture------------------------ in classroom
router
  .route("/:classroomId/lectures")
  .post(
    createLectureValidator,
    handleValidation,
    authorizeOwnerMiddleware("classroom"),
    createLecture,
  );

router
  .route("/:classroomId/lectures/:id")
  .put(
    updateLectureValidator,
    handleValidation,
    authorizeOwnerMiddleware("lecture"),
    updateLecture,
  )
  .delete(
    idParamValidator,
    handleValidation,
    authorizeOwnerMiddleware("lecture"),
    deleteClassroom,
  );

router.get(
  "/:classroomId/students/:studentId/assignment-progress",
  isEnrolled,
  getStudentAssignmentProgress,
);

export default router;
