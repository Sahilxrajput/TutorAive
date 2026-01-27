"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const lectureSession = new mongoose_1.Schema({
    classroom: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Classroom",
        required: true,
    },
    title: { type: String, required: true },
    description: String,
    startTime: { type: Date, required: true },
    endTime: Date,
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    recurrenceRule: String, // optional iCalendar-style recurrence
    delayReason: {
        type: String,
    },
    cancelReason: {
        type: String,
    },
    isAttendanceLocked: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: [
            "scheduled",
            "rescheduled",
            "delayed",
            "live",
            "completed",
            "cancelled",
        ],
        default: "scheduled",
    },
}, { timestamps: true });
const Lecture = mongoose_1.models.lectureSession || (0, mongoose_1.model)("Lecture", lectureSession);
exports.default = Lecture;
