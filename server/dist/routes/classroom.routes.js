"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const classroom_controller_1 = require("../controllers/classroom.controller");
const classroom_validator_1 = require("../validators/classroom.validator");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const handleValidation_1 = require("../middlewares/handleValidation");
const Instructor_middleware_1 = require("../middlewares/Instructor.middleware");
const lecture_controller_1 = require("../controllers/lecture.controller");
const user_controller_1 = require("../controllers/user.controller");
const lecture_validtor_1 = require("../validators/lecture.validtor");
const isEnrolled_middleware_1 = require("../middlewares/isEnrolled.middleware");
const assignment_controller_1 = require("../controllers/assignment.controller");
const authorizeOwner_middleware_1 = require("../middlewares/authorizeOwner.middleware");
const note_controller_1 = require("../controllers/note.controller");
const invitation_controller_1 = require("../controllers/invitation.controller");
const cloudinary_1 = require("../lib/cloudinary");
const router = express_1.default.Router();
// Get all classrooms
router.get("/", classroom_controller_1.getClassrooms);
// Get all enrolledclassrooms
router.use(auth_middleware_1.default); // all routes require auth
router.get("/enrolled", user_controller_1.getAllEnrolledClassrooms);
// Get classroom by ID
router.get("/:id", classroom_validator_1.idParamValidator, handleValidation_1.handleValidation, classroom_controller_1.getClassroomById);
// Join classroom by code
router.get("/:classroomId/join/:code", classroom_validator_1.joinClassroomByCodeValidator, handleValidation_1.handleValidation, invitation_controller_1.useInvitation);
//@todo enroll classroom by purchase
router.post("/enroll", classroom_validator_1.joinClassroomValidator, handleValidation_1.handleValidation, classroom_controller_1.enrollClassroom);
router.get("/:classroomId/students/:studentId/assignment-progress", isEnrolled_middleware_1.isEnrolled, assignment_controller_1.getStudentAssignmentProgress);
//!@check create a --------------------lecture / assignmnet/ students------------------------ in classroom
router.get("/:classroomId/resources", isEnrolled_middleware_1.isEnrolled, note_controller_1.getResources);
// isInstructor?
router.use(Instructor_middleware_1.isInstructor);
router.get("/:classroomId/create-invitation", (0, authorizeOwner_middleware_1.authorizeOwnerMiddleware)("classroom"), invitation_controller_1.createInvitation);
router.post("/:classroomId/send-invitation", (0, authorizeOwner_middleware_1.authorizeOwnerMiddleware)("classroom"), invitation_controller_1.sendInvitationMail);
// Create a new classroom
router.post("/", cloudinary_1.upload.single("thumbnail"), classroom_validator_1.createClassroomValidator, handleValidation_1.handleValidation, classroom_controller_1.createClassroom);
// Update classroom
router.put("/:id", classroom_validator_1.updateClassroomValidator, handleValidation_1.handleValidation, classroom_controller_1.updateClassroom);
// Archive classroom
router.put("/:id/archive", classroom_validator_1.idParamValidator, handleValidation_1.handleValidation, classroom_controller_1.archiveClassroom);
router.get("/:classroomId/students", isEnrolled_middleware_1.isEnrolled, classroom_controller_1.getStudents);
//!@check create a --------------------lecture------------------------ in classroom
router
    .route("/:classroomId/lectures")
    .post(lecture_validtor_1.createLectureValidator, handleValidation_1.handleValidation, (0, authorizeOwner_middleware_1.authorizeOwnerMiddleware)("classroom"), lecture_controller_1.createLecture);
router
    .route("/:classroomId/lectures/:id")
    .put(lecture_validtor_1.updateLectureValidator, handleValidation_1.handleValidation, (0, authorizeOwner_middleware_1.authorizeOwnerMiddleware)("lecture"), lecture_controller_1.updateLecture)
    .delete(classroom_validator_1.idParamValidator, handleValidation_1.handleValidation, (0, authorizeOwner_middleware_1.authorizeOwnerMiddleware)("lecture"), classroom_controller_1.deleteClassroom);
//! create a --------------------lecture------------------------ in classroom
router.post("/:classroomId/resources", (0, authorizeOwner_middleware_1.authorizeOwnerMiddleware)("classroom"), assignment_controller_1.cloudinarySignature);
//@todo middleware
router.post("/:classroomId/resources/save", (0, authorizeOwner_middleware_1.authorizeOwnerMiddleware)("classroom"), note_controller_1.saveResources);
exports.default = router;
