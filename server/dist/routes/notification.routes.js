"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../controllers/notification.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = (0, express_1.Router)();
router.use(auth_middleware_1.default);
router.get("/", notification_controller_1.getMyNotifications);
router.get("/unread-count", notification_controller_1.getUnreadCount);
router.patch("/:id/mark-read", notification_controller_1.markAsRead);
router.patch("/mark-all-read", notification_controller_1.markAllAsRead);
exports.default = router;
