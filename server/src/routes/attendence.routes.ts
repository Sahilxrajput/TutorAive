import express from "express";
import {
  exportAttendanceCSV,
  exportAttendancePDF,
  attendenceLock,
  attendenceAggregation,
  startLecture,
  markAttendance,
  getLectureAttendance,
  getStudentAttendance,
} from "../controllers/attendence.controller";
import { isEnrolled } from "../middlewares/isEnrolled.middleware";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

// mark / update attendance (teacher)
router.post("/", markAttendance);

// get attendance of a lecture
router.get("/lecture/:lectureId", getLectureAttendance);

// get attendance of a student
router.get("/student/:studentId", getStudentAttendance);

//@todo it should be move to socket
router.get("/lecture/:lectureId/start", startLecture);
router.get("/lecture/:lectureId/export/pdf", exportAttendancePDF);
router.get("/lecture/:lectureId/export/csv", exportAttendanceCSV);
router.post("/lecture/:lectureId/lock", attendenceLock);
// @todo only that student and teacher
router.get(
  "/percentage/:classroomId/:studentId",
  isEnrolled,
  attendenceAggregation,
);

export default router;
