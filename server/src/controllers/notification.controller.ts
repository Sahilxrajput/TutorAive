import { Request, Response } from "express";
import { Notification } from "../models/notification.model";
import mongoose from "mongoose";

export const getMyNotifications = async (req: Request, res: Response) => {
  const notifications = await Notification.find({
    user: req.userId,
  })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({ success: true, data: notifications });
};

export const getUnreadCount = async (req: Request, res: Response) => {
  const count = await Notification.countDocuments({
    user: req.userId,
    isRead: false,
  });

  res.json({ success: true, count });
};

export const markAsRead = async (req: Request, res: Response) => {
  const { id } = req.params;
    console.log("id:",id)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid notification ID" });
  }

  await Notification.updateOne(
    { _id: id, user: req.userId },
    { $set: { isRead: true } }
  );

  res.json({ success: true });
};

export const markAllAsRead = async (req: Request, res: Response) => {
  await Notification.updateMany(
    { user: req.userId, isRead: false },
    { $set: { isRead: true } }
  );

  res.json({ success: true });
};
