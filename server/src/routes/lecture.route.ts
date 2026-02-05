import express from "express";
import {
  attendanceLock,
  getClassroomLectures,
  getAllLecturesForInstructor,
  getAllLecturesForStudent,
  getAllScheduleLecturesForClassroom,
  getAllScheduleLecturesForInstructor,
  getAllScheduleLecturesForStudent,
} from "../controllers/lecture.controller";
import authMiddleware from "../middlewares/auth.middleware";
import {
  createLectureValidator,
  updateLectureValidator,
} from "../validators/lecture.validtor";
import { handleValidation } from "../middlewares/handleValidation";
import { authorizeOwnerMiddleware } from "../middlewares/authorizeOwner.middleware";

const router = express.Router();

router.use(authMiddleware);
// ? @fix does i need to use instructor middleware

// Instructor: get all lectures created by the authenticated instructor (no classroom filter)
router.get("/created", getAllLecturesForInstructor);

// Student: get all lectures available to the authenticated student (no classroom filter)
router.get("/my", getAllLecturesForStudent);

// Get all lectures created for a specific classroom. Route param: classroomId
router.get(
  "/all/:classroomId",
  getClassroomLectures,
);

// @ok  Instructor: get scheduled (upcoming) lectures visible to the instructor
router.get("/scheduled/created", getAllScheduleLecturesForInstructor);

// @ok Student: get scheduled (upcoming) lectures visible to the student
router.get("/scheduled/my", getAllScheduleLecturesForStudent);

// Get scheduled lectures for a specific classroom. Route param: classroomId
router.get("/scheduled/:classroomId", getAllScheduleLecturesForClassroom);

router.post(
  "/:id/attendance-lock",
  authorizeOwnerMiddleware("lecture"),
  attendanceLock,
);

export default router;
