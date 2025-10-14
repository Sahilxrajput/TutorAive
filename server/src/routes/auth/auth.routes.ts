import { Router } from "express";
import passport from "passport";
import generateAuthToken from "../../utils/generateAuthToken";
import authMiddleware from "../../Middlewares/authMiddleware";

const authRouter = Router();

// Auth routes
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/callback/google",
  passport.authenticate("google", { failureRedirect: "/login/failed" }),
  (req, res) => {
    const user = req.user as any;
    const token = generateAuthToken(user);

    // Set token in HTTP-only cookie
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
  }
);

authRouter.get("/login/failed", (req, res) => {
  console.log("login failed");
  res.status(401).json({ success: false, message: "Login failed" });
});

authRouter.get("/logout", authMiddleware, (req, res) => {
  // Clear the cookie named 'token'
  res.clearCookie("token", {
    httpOnly: true, // must match cookie options when set
    secure: process.env.NODE_ENV === "production", // only send over HTTPS in production
    sameSite: "strict", // recommended for security
    path: "/", // must match cookie path
  });
  console.log("logout called")
  // Optionally, you can send a response
  res.status(200).json({ message: "Logged out successfully" });
});

export default authRouter;
