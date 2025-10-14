import express from "express";
import {
  createClassroom,
  getClassrooms,
  getClassroomById,
  updateClassroom,
  deleteClassroom,
  joinClassroom,
  archiveClassroom,
} from "../controllers/classroom.controller";
import {
  createClassroomValidator,
  updateClassroomValidator,
  joinClassroomValidator,
  idParamValidator,
} from "../validators/classroom.schema";

import authMiddleware from "../Middlewares/authMiddleware";
import { handleValidation } from "../Middlewares/validate";

const router = express.Router();
router.use(authMiddleware); // all routes require auth


// Create a new classroom
router.post("/", createClassroomValidator, handleValidation, createClassroom);

// Get all classrooms
router.get("/", getClassrooms);

// Get classroom by ID
router.get("/:id", idParamValidator, handleValidation, getClassroomById);

// Update classroom
router.put("/:id", updateClassroomValidator, handleValidation, updateClassroom);

// Delete classroom
router.delete("/:id", idParamValidator, handleValidation, deleteClassroom);

// Join classroom
router.post("/join", joinClassroomValidator, handleValidation, joinClassroom);

// Archive classroom
router.put("/:id/archive", idParamValidator, handleValidation, archiveClassroom);


export default router;
