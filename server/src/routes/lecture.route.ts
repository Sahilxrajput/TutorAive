import express from "express";
import {
  createLecture,
  deleteLecture,
  getAllClassroomLectures,
  getAllLecturesForInstructor,
  getAllLecturesForStudent,
  getAllScheduleLecturesForClassroom,
  getAllScheduleLecturesForInstructor,
  getAllScheduleLecturesForStudent,
  updateLecture,
} from "../controllers/lecture.controller";
import authMiddleware from "../Middlewares/auth.middleware";
import {
  createLectureValidator,
  updateLectureValidator,
} from "../validators/lecture.validtor";
import { handleValidation } from "../Middlewares/handleValidation";

const router = express.Router();

router.use(authMiddleware);
// ? @fix does i need to use instructor middleware
// @ok Create a new lecture. Expects lecture data in the request body.
router.post("/", createLectureValidator, handleValidation, createLecture);

// @ok Delete a lecture by its id. Route param: id
router.delete("/:id", deleteLecture);

// @ok Update an existing lecture by id. Route param: id. Expects updated fields in body.
router.put("/:id", updateLectureValidator, handleValidation, updateLecture);

// Instructor: get all lectures created by the authenticated instructor (no classroom filter)
router.get("/created", getAllLecturesForInstructor);

// Student: get all lectures available to the authenticated student (no classroom filter)
router.get("/my", getAllLecturesForStudent);

// Get all lectures created for a specific classroom. Route param: classroomId
router.get("/all/:classroomId", getAllClassroomLectures);

// @ok  Instructor: get scheduled (upcoming) lectures visible to the instructor
router.get("/scheduled/created", getAllScheduleLecturesForInstructor);

// @ok Student: get scheduled (upcoming) lectures visible to the student
router.get("/scheduled/my", getAllScheduleLecturesForStudent);

// Get scheduled lectures for a specific classroom. Route param: classroomId
router.get("/scheduled/:classroomId", getAllScheduleLecturesForClassroom);

export default router;
