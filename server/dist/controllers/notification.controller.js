"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllAsRead = exports.markAsRead = exports.getUnreadCount = exports.getMyNotifications = void 0;
const notification_model_1 = require("../models/notification.model");
const mongoose_1 = __importDefault(require("mongoose"));
const getMyNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notifications = yield notification_model_1.Notification.find({
        user: req.userId,
    })
        .sort({ createdAt: -1 })
        .limit(50);
    res.json({ success: true, data: notifications });
});
exports.getMyNotifications = getMyNotifications;
const getUnreadCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield notification_model_1.Notification.countDocuments({
        user: req.userId,
        isRead: false,
    });
    res.json({ success: true, count });
});
exports.getUnreadCount = getUnreadCount;
const markAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log("id:", id);
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid notification ID" });
    }
    yield notification_model_1.Notification.updateOne({ _id: id, user: req.userId }, { $set: { isRead: true } });
    res.json({ success: true });
});
exports.markAsRead = markAsRead;
const markAllAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield notification_model_1.Notification.updateMany({ user: req.userId, isRead: false }, { $set: { isRead: true } });
    res.json({ success: true });
});
exports.markAllAsRead = markAllAsRead;
