"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attendence_controller_1 = require("../controllers/attendence.controller");
const isEnrolled_middleware_1 = require("../middlewares/isEnrolled.middleware");
const router = express_1.default.Router();
//@todo it should be move to socket
router.get("/lecture/:lectureId/start", attendence_controller_1.startLecture);
router.get("/lecture/:lectureId/export/pdf", attendence_controller_1.exportAttendancePDF);
router.get("/lecture/:lectureId/export/csv", attendence_controller_1.exportAttendanceCSV);
router.post("/lecture/:lectureId/lock", attendence_controller_1.attendenceLock);
// @todo only that student and teacher
router.get("/percentage/:classroomId/:studentId", isEnrolled_middleware_1.isEnrolled, attendence_controller_1.attendenceAggregation);
exports.default = router;
