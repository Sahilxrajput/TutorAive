import express from "express";
import {
  createInvitation,
  getInvitationsByClassroom,
  getInvitationByCode,
  useInvitation,
  deleteInvitation,
} from "../controllers/invitation.controller";
import authMiddleware from "../Middlewares/auth.middleware";
import {isInstructor} from "../Middlewares/Instructor.middleware";

const router = express.Router();

// Routes
router.use(authMiddleware);

router.get("/:code", getInvitationByCode);
router.get("/classroom/:id", getInvitationsByClassroom);
router.post("/:code/use", useInvitation);

// Instructor Only
router.use(isInstructor);

router.post("/", createInvitation);
router.delete("/:id", deleteInvitation);

export default router;
