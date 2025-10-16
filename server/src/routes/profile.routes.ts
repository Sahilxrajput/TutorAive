import { Router } from "express";
import authMiddleware from "../Middlewares/authMiddleware";
import { getUserProfile, myProfile } from "../controllers/user.controller";

const profileRouter = Router();

// auth
profileRouter.use(authMiddleware)

// profile
profileRouter.get("/me", myProfile);

// get a user by id
profileRouter.get("/:id", getUserProfile);

export default profileRouter;
