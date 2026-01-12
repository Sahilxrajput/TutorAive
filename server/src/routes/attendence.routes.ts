import express from "express";
import {
  exportAttendanceCSV,
  exportAttendancePDF,
  attendenceLock,
  attendenceAggregation,
  startLecture,
} from "../controllers/attendence.controller";
import { isEnrolled } from "../Middlewares/isEnrolled.middleware";

const router = express.Router();

//@todo it should be move to socket
router.get("/lecture/:lectureId/start", startLecture);
router.get("/lecture/:lectureId/export/pdf", exportAttendancePDF);
router.get("/lecture/:lectureId/export/csv", exportAttendanceCSV);
router.post("/lecture/:lectureId/lock", attendenceLock);
// @todo only that student and teacher
router.get(
  "/percentage/:classroomId/:studentId",
  isEnrolled,
  attendenceAggregation
);

export default router;
