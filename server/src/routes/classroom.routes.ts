import express from "express";
import {
  createClassroom,
  getClassrooms,
  getClassroomById,
  updateClassroom,
  deleteClassroom,
  archiveClassroom,
  getStudents,
  enrollClassroom,
} from "../controllers/classroom.controller";
import {
  createClassroomValidator,
  updateClassroomValidator,
  joinClassroomValidator,
  idParamValidator,
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
  cloudinarySignature,
} from "../controllers/assignment.controller";
import { authorizeOwnerMiddleware } from "../middlewares/authorizeOwner.middleware";
import { getResources, saveResources } from "../controllers/note.controller";
import { createInvitation, sendInvitationMail, useInvitation } from "../controllers/invitation.controller";

const router = express.Router();

// Get all classrooms
router.get("/", getClassrooms);

// Get all enrolledclassrooms

router.use(authMiddleware); // all routes require auth
router.get("/enrolled", getAllEnrolledClassrooms);

// Get classroom by ID
router.get("/:id", idParamValidator, handleValidation, getClassroomById);

// Join classroom by code
router.get(
  "/:classroomId/join/:code",
  joinClassroomByCodeValidator,
  handleValidation,
  useInvitation,
);

//@todo enroll classroom by purchase
router.post(
  "/enroll",
  joinClassroomValidator,
  handleValidation,
  enrollClassroom,
);

router.get(
  "/:classroomId/students/:studentId/assignment-progress",
  isEnrolled,
  getStudentAssignmentProgress,
);

//!@check create a --------------------lecture / assignmnet/ students------------------------ in classroom
router.get("/:classroomId/resources", isEnrolled, getResources);

// isInstructor?
router.use(isInstructor);

router.get(
  "/:classroomId/create-invitation",
  authorizeOwnerMiddleware("classroom"),
  createInvitation,
);

router.post(
  "/:classroomId/send-invitation",
  authorizeOwnerMiddleware("classroom"),
  sendInvitationMail,
);

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

router.get("/:classroomId/students", isEnrolled, getStudents);

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

//! create a --------------------lecture------------------------ in classroom
router.post(
  "/:classroomId/resources",
  authorizeOwnerMiddleware("classroom"),
  cloudinarySignature,
);

//@todo middleware
router.post(
  "/:classroomId/resources/save",
  authorizeOwnerMiddleware("classroom"),
  saveResources,
);

export default router;
