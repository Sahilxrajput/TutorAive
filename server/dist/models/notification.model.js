"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: ["lecture", "assignment", "message", "system"],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    data: {
        classroomId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Classroom" },
        tweetId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Tweet" },
        lectureId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Lecture" },
        assignmentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Assignment" },
        reason: String,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: { createdAt: true, updatedAt: false } });
exports.Notification = mongoose_1.models.Notification ||
    (0, mongoose_1.model)("Notification", NotificationSchema);
