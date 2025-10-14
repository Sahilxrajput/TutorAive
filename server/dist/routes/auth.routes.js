"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const generateAuthToken_1 = __importDefault(require("../utils/generateAuthToken"));
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
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
});
authRouter.get("/login/failed", (req, res) => {
    res.status(401).json({ success: false, message: "Login failed" });
});
exports.default = authRouter;
