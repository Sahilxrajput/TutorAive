import { Router } from "express";
import passport from "passport";
import generateAuthToken from "../utils/generateAuthToken";
import authMiddleware from "../Middlewares/auth.middleware";
import {
  deleteAccount,
  forgotPassword,
  signin,
  loginfailed,
  logout,
  resetPassword,
  signup,
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
  (req, res) => {
    const user = req.user as any;
    const token = generateAuthToken(user);

    // Set token in HTTP-only cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.redirect(`${process.env.CLIENT_URL}/auth/success`);
  }
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
