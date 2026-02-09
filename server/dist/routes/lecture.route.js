"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lecture_controller_1 = require("../controllers/lecture.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const authorizeOwner_middleware_1 = require("../middlewares/authorizeOwner.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.default);
// ? @fix does i need to use instructor middleware
// Instructor: get all lectures created by the authenticated instructor (no classroom filter)
router.get("/created", lecture_controller_1.getAllLecturesForInstructor);
// Student: get all lectures available to the authenticated student (no classroom filter)
router.get("/my", lecture_controller_1.getAllLecturesForStudent);
// Get all lectures created for a specific classroom. Route param: classroomId
router.get("/all/:classroomId", lecture_controller_1.getClassroomLectures);
// @ok  Instructor: get scheduled (upcoming) lectures visible to the instructor
router.get("/scheduled/created", lecture_controller_1.getAllScheduleLecturesForInstructor);
// @ok Student: get scheduled (upcoming) lectures visible to the student
router.get("/scheduled/my", lecture_controller_1.getAllScheduleLecturesForStudent);
// Get scheduled lectures for a specific classroom. Route param: classroomId
router.get("/scheduled/:classroomId", lecture_controller_1.getAllScheduleLecturesForClassroom);
router.post("/:id/attendance-lock", (0, authorizeOwner_middleware_1.authorizeOwnerMiddleware)("lecture"), lecture_controller_1.attendanceLock);
exports.default = router;
