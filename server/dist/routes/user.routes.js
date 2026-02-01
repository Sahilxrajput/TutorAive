"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
// auth
router.use(auth_middleware_1.default);
// get all the enrolled courses of user
router.get("/enrolled", user_controller_1.getAllEnrolledClassrooms);
// get a user by id
router.get("/:id", user_controller_1.getUserProfile);
exports.default = router;
