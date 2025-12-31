import express from "express";
import {
  getAssignmentsForStudent,
  getAssignmentById,
  getAssignmentsByClassroomId,
  updateAssignment,
  deleteAssignment,
  getAssignmentsForInstructor,
  getStudentAssignmentsForClassroom,
  cloudinarySignature,
  saveAssignment,
  getAllAssignmentsInClassroomId,
} from "../controllers/assignment.controller";
import authMiddleware from "../Middlewares/auth.middleware";
import {
  isClassroomCreator,
  isInstructor,
} from "../Middlewares/Instructor.middleware";
import { upload } from "../lib/cloudinary";
import { isEnrolled } from "../Middlewares/isEnrolled.middleware";
import {
  classroomIdParamValidator,
  idParamValidator,
} from "../validators/classroom.validator";
import { handleValidation } from "../Middlewares/handleValidation";

const router = express.Router();

// Require auth for all assignment routes
router.use(authMiddleware);
// router.use(authMiddleware, isEnrolled);//!@todo isEnrolled also check user logedin or not

// Enrolled actions
router.get("/student", getAssignmentsForStudent);
router.get("/instructor", getAssignmentsForInstructor); // @todo isInstructor middleware
router.get("/classroom/:classroomId", getAssignmentsByClassroomId);
router.get(
  "/classroom/:classroomId/student/:studentId",
  getStudentAssignmentsForClassroom
);
router.get("/:id", getAssignmentById);
router.get("/classroom/:classroomId/my", getAllAssignmentsInClassroomId);

// Instructor-only routes
router.use(isInstructor);


router.post(
  "/:classroomId/cloudinary/signature",
  isClassroomCreator,
  cloudinarySignature
);

router.post("/:classroomId/save", isClassroomCreator, saveAssignment);

router.put("/:id", isClassroomCreator, updateAssignment);
router.delete("/:id", isClassroomCreator, deleteAssignment);

export default router;
