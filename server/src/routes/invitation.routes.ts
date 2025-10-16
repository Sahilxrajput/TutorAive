import express from "express";
import {
  createInvitation,
  getInvitationsByClassroom,
  getInvitationByCode,
  useInvitation,
  deleteInvitation,
} from "../controllers/invitation.controller";
import authMiddleware from "../Middlewares/authMiddleware";
import isInstructor from "../Middlewares/isInstructor";

const invitationRouter = express.Router();

// Routes
invitationRouter.use(authMiddleware)

invitationRouter.get("/:code", getInvitationByCode);
invitationRouter.get("/classroom/:id", getInvitationsByClassroom);
invitationRouter.post("/:code/use", useInvitation);

// Instructor Only
invitationRouter.use(isInstructor)

invitationRouter.post("/", createInvitation);
invitationRouter.delete("/:id", deleteInvitation);

export default invitationRouter;
