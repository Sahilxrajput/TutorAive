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
import isInstructor from "../Middlewares/isInstructor";

const classRouter = express.Router();

classRouter.use(authMiddleware); // all routes require auth


// Get all classrooms
classRouter.get("/", getClassrooms);

// Get classroom by ID
classRouter.get("/:id", idParamValidator, handleValidation, getClassroomById);

// isInstructor?
classRouter.use(isInstructor)

// Create a new classroom
classRouter.post("/", createClassroomValidator, handleValidation,  createClassroom);


// Update classroom
classRouter.put("/:id", updateClassroomValidator, handleValidation, updateClassroom);

// Delete classroom
classRouter.delete("/:id", idParamValidator, handleValidation, deleteClassroom);

// Join classroom
classRouter.post("/join", joinClassroomValidator, handleValidation, joinClassroom);

// Archive classroom
classRouter.put("/:id/archive", idParamValidator, handleValidation, archiveClassroom);


export default classRouter;
