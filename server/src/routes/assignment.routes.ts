import express from "express";
import {
  getAssignmentsOfStudent,
  getAssignmentById,
  getAssignmentsByClassroomId,
  updateAssignment,
  deleteAssignment,
  getAssignmentsForInstructor,
  cloudinarySignature,
  saveAssignment,
} from "../controllers/assignment.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { isInstructor } from "../middlewares/Instructor.middleware";
import { upload } from "../lib/cloudinary";
import { isEnrolled } from "../middlewares/isEnrolled.middleware";
import {
  classroomIdParamValidator,
  idParamValidator,
  saveAssignmentValidator,
} from "../validators/classroom.validator";
import { handleValidation } from "../middlewares/handleValidation";
import { body, param } from "express-validator";
import { authorizeOwner } from "../utils/authorization/authorizeOwner";
import { authorizeOwnerMiddleware } from "../middlewares/authorizeOwner.middleware";

const router = express.Router();

// Require auth for all assignment routes
router.use(authMiddleware);
// router.use(authMiddleware, isEnrolled);//!@todo isEnrolled also check user logedin or not

//get all assignments of a student pending  + submitted
router.get("/student/:studentId", getAssignmentsOfStudent); //isuser isself , isinsructor

router.get("/:id", isEnrolled, getAssignmentById);

// Instructor-only routes
// router.use(isInstructor); //@check no need

router.post("/:classroomId/cloudinary/signature", authorizeOwnerMiddleware, cloudinarySignature);

router.post(
  "/:classroomId/save",
  saveAssignmentValidator,
  handleValidation, // This middleware should check validationResult(req)
  saveAssignment,
);
//get all assignments of classroom -> for instructor
router.get("/classroom/:classroomId", authorizeOwnerMiddleware, getAssignmentsByClassroomId);

//get all assignments of all classroom created by instructor
router.get("/instructor", getAssignmentsForInstructor);

// router.put("/:id", updateAssignment);
router.delete("/:id", authorizeOwnerMiddleware, deleteAssignment);

export default router;
