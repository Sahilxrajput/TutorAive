"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const generateAuthToken_1 = __importDefault(require("../../utils/generateAuthToken"));
const authMiddleware_1 = __importDefault(require("../../Middlewares/authMiddleware"));
const authRouter = (0, express_1.Router)();
// Auth routes
authRouter.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
authRouter.get("/callback/google", passport_1.default.authenticate("google", { failureRedirect: "/login/failed" }), (req, res) => {
    const user = req.user;
    const token = (0, generateAuthToken_1.default)(user);
    // Set token in HTTP-only cookie
    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
});
authRouter.get("/login/failed", (req, res) => {
    console.log("login failed");
    res.status(401).json({ success: false, message: "Login failed" });
});
authRouter.get("/logout", authMiddleware_1.default, (req, res) => {
    // Clear the cookie named 'token'
    res.clearCookie("token", {
        httpOnly: true, // must match cookie options when set
        secure: process.env.NODE_ENV === "production", // only send over HTTPS in production
        sameSite: "strict", // recommended for security
        path: "/", // must match cookie path
    });
    console.log("logout called");
    // Optionally, you can send a response
    res.status(200).json({ message: "Logged out successfully" });
});
exports.default = authRouter;
