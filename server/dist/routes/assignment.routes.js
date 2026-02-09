"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assignment_controller_1 = require("../controllers/assignment.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const isEnrolled_middleware_1 = require("../middlewares/isEnrolled.middleware");
const classroom_validator_1 = require("../validators/classroom.validator");
const handleValidation_1 = require("../middlewares/handleValidation");
const authorizeOwner_middleware_1 = require("../middlewares/authorizeOwner.middleware");
const router = express_1.default.Router();
// Require auth for all assignment routes
router.use(auth_middleware_1.default);
// router.use(authMiddleware, isEnrolled);//!@todo isEnrolled also check user logedin or not
//get all assignments of a student pending  + submitted
router.get("/student/:studentId", assignment_controller_1.getAssignmentsOfStudent); //isuser isself , isinsructor
router.get("/:id", isEnrolled_middleware_1.isEnrolled, assignment_controller_1.getAssignmentById);
// Instructor-only routes
// router.use(isInstructor); //@check no need
router.post("/:classroomId/cloudinary/signature", (0, authorizeOwner_middleware_1.authorizeOwnerMiddleware)("classroom"), assignment_controller_1.cloudinarySignature);
router.post("/:classroomId/save", classroom_validator_1.saveAssignmentValidator, handleValidation_1.handleValidation, // This middleware should check validationResult(req)
assignment_controller_1.saveAssignment);
//get all assignments of classroom -> for instructor
router.get("/classroom/:classroomId", authorizeOwner_middleware_1.authorizeOwnerMiddleware, assignment_controller_1.getAssignmentsByClassroomId);
//get all assignments of all classroom created by instructor
router.get("/instructor", assignment_controller_1.getAssignmentsForInstructor);
// router.put("/:id", updateAssignment);
router.delete("/:id", authorizeOwner_middleware_1.authorizeOwnerMiddleware, assignment_controller_1.deleteAssignment);
exports.default = router;
