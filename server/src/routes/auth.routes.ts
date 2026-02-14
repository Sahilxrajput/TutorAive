import { Router } from "express";
import passport from "passport";
import authMiddleware from "../middlewares/auth.middleware";
import {
  deleteAccount,
  forgotPassword,
  signup,
  signin,
  loginfailed,
  signout,
  resetPassword,
  googleCallback,
  refreshAccessToken,
} from "../controllers/auth.controller";

const router = Router();

router.get("/google", (req, res, next) => {
  let role = req.query.role;
  if (Array.isArray(role)) role = role[0];
  if (typeof role !== "string") role = "student";

  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state: role, // send role through OAuth
  })(req, res, next);
});

// google callback route
router.get(
  "/callback/google",
  (req, _res, next) => {
    // extract role from state
    (req as any).role = req.query.state || "student";
    next();
  },
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login/failed",
  }),
  googleCallback,
);

// login failed
router.get("/login/failed", loginfailed);

// @todo validation
router.post("/signup", signup);

// @todo validation
router.post("/signin", signin);
router.get("/refresh", refreshAccessToken);

router.get("/signout", authMiddleware, signout);
router.put("/reset-password", authMiddleware, resetPassword);
router.put("/forget-password", authMiddleware, forgotPassword);
router.delete("/delete", authMiddleware, deleteAccount);

export default router;
