import { Router } from "express";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
} from "../controllers/notification.controller";
import authMiddleware from "../Middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getMyNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/:id/mark-read", markAsRead);
router.patch("/mark-all-read", markAllAsRead);

export default router;
