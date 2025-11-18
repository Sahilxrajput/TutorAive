import { Router } from "express";
import passport from "passport";
import authMiddleware from "../Middlewares/auth.middleware";
import {
  deleteAccount,
  forgotPassword,
  signin,
  loginfailed,
  logout,
  resetPassword,
  signup,
  googleCallback,
} from "../controllers/auth.controller";

const router = Router();

// google route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// google callback route
router.get(
  "/callback/google",
  passport.authenticate("google", { failureRedirect: "/login/failed" }),
  googleCallback
);

// login failed
router.get("/login/failed", loginfailed);

// @todo validation
router.post("/signup", signup);

// @todo validation
router.post("/signin", signin);

router.get("/logout", authMiddleware, logout);
router.put("/reset-password", authMiddleware, resetPassword);
router.put("/forget-password", authMiddleware, forgotPassword);
router.delete("/delete", authMiddleware, deleteAccount);

export default router;
