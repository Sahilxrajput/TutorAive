import express from "express";
import {
  createInvitation,
  getInvitationsByClassroom,
  getInvitationByCode,
  useInvitation,
  deleteInvitation,
} from "../controllers/invitation.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { isInstructor } from "../middlewares/Instructor.middleware";

const router = express.Router();

// Routes
router.use(authMiddleware);

// @remind !check lecture or classroom or both
router.get("/:code", getInvitationByCode);
router.get("/classroom/:id", getInvitationsByClassroom);
router.post("/:code/use", useInvitation);

// Instructor Only
router.use(isInstructor);

router.post("/", createInvitation);
router.delete("/:id", deleteInvitation);

export default router;
