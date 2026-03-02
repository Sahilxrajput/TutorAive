"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const auth_controller_1 = require("../controllers/auth.controller");
const rateLimit_1 = require("../middlewares/rateLimit");
const router = (0, express_1.Router)();
router.get("/google", rateLimit_1.authLimiter, (req, res, next) => {
    let role = req.query.role;
    if (Array.isArray(role))
        role = role[0];
    if (typeof role !== "string")
        role = "student";
    passport_1.default.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
        state: role, // send role through OAuth
    })(req, res, next);
});
// google callback route
router.get("/callback/google", (req, _res, next) => {
    // extract role from state
    req.role = req.query.state || "student";
    next();
}, passport_1.default.authenticate("google", {
    session: false,
    failureRedirect: "/login/failed",
}), auth_controller_1.googleCallback);
// login failed
router.get("/login/failed", rateLimit_1.authLimiter, auth_controller_1.loginfailed);
// @todo validation
router.post("/signup", rateLimit_1.authLimiter, auth_controller_1.signup);
// @todo validation
router.post("/signin", rateLimit_1.authLimiter, auth_controller_1.signin);
router.post("/refresh", rateLimit_1.refreshLimiter, auth_controller_1.refreshAccessToken);
router.get("/signout", auth_middleware_1.default, auth_controller_1.signout);
// router.put("/reset-password", authMiddleware, resetPassword);
// router.put("/forget-password", authMiddleware, forgotPassword);
// router.delete("/delete", authMiddleware, deleteAccount);
exports.default = router;
