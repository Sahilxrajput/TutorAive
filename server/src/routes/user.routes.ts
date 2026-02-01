import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
  getAllEnrolledClassrooms,
  getUserProfile,
} from "../controllers/user.controller";

const router = Router();

// auth
router.use(authMiddleware);

// get all the enrolled courses of user
router.get("/enrolled", getAllEnrolledClassrooms);

// get a user by id
router.get("/:id", getUserProfile);

export default router;
