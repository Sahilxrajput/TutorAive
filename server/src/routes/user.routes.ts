import { Router } from "express";
import authMiddleware from "../Middlewares/auth.middleware";
import {
  getAllEnrolledClassrooms,
  getUserProfile,
  myProfile,
} from "../controllers/user.controller";

const router = Router();

// auth
router.use(authMiddleware);

// profile
router.get("/me", myProfile);

// get all the enrolled courses of user
router.get("/enrolled", getAllEnrolledClassrooms);

// get a user by id
router.get("/:id", getUserProfile);

export default router;
