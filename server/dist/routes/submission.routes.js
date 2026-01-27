"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const submission_controller_1 = require("../controllers/submission.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const Instructor_middleware_1 = require("../middlewares/Instructor.middleware");
const assignment_controller_1 = require("../controllers/assignment.controller");
const router = express_1.default.Router();
router.use(auth_middleware_1.default);
// @todo isEnrolled middleware
// upload signature
router.post("/assignments/:assignmentId/cloudinary/signature", assignment_controller_1.cloudinarySignature);
// submit assignment
router.post("/assignments/:assignmentId/save", submission_controller_1.saveSubmission);
// get my submission for an assignment
router.get("/assignments/:assignmentId/me", submission_controller_1.getStudentSubmission);
// get submission by id (student or teacher)
router.get("/:id", submission_controller_1.getSubmissionById);
/* -------------------- Instructor routes -------------------- */
router.use(Instructor_middleware_1.isInstructor);
// get all submissions for an assignment
router.get("/assignments/:assignmentId", submission_controller_1.getSubmissions);
// grade a submission
router.put("/:id/grade", submission_controller_1.gradeSubmission);
exports.default = router;
