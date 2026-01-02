import express from "express";
import {
  getAssignmentsOfStudent,
  getAssignmentById,
  getAssignmentsByClassroomId,
  updateAssignment,
  deleteAssignment,
  getAssignmentsForInstructor,
  getStudentAssignmentsInClassroom,
  cloudinarySignature,
  saveAssignment,
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

//get all assignments of a student pending  + submitted
router.get("/student/:studentId", getAssignmentsOfStudent); //isuser isself , isinsructor

//get all classroom assignments of student pending  + submitted
router.get(
  "/classroom/:classroomId/student/:studentId",
  isEnrolled, // techer / enrolled student -> true
  getStudentAssignmentsInClassroom
);

router.get("/:id", isEnrolled, getAssignmentById); 

// Instructor-only routes
// router.use(isInstructor); //@check no need

router.post(
  "/:classroomId/cloudinary/signature",
  isClassroomCreator,
  cloudinarySignature
);

router.post("/:classroomId/save", isClassroomCreator, saveAssignment);

//get all assignments of classroom -> for instructor
router.get(
  "/classroom/:classroomId",
  isClassroomCreator,
  getAssignmentsByClassroomId
);

//get all assignments of all classroom created by instructor
router.get("/instructor", getAssignmentsForInstructor);

router.put("/:id", updateAssignment);
router.delete("/:id", deleteAssignment);

export default router;
