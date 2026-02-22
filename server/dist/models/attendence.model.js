"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// models/Attendance.ts
const mongoose_1 = require("mongoose");
const AttendanceSchema = new mongoose_1.Schema({
    lecture: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Lecture",
        required: true,
        index: true,
    },
    student: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    status: {
        type: String,
        enum: ["present", "absent", "late"],
        default: "absent",
        required: true,
    },
    joinTime: Date,
    leaveTime: Date,
    markedAt: Date,
    totalDuration: {
        type: Number,
        default: 0, // in milliseconds
    },
    markedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User", // teacher/admin
    },
}, { timestamps: true });
// one attendance per student per class per lecture
AttendanceSchema.index({ student: 1, lecture: 1 }, { unique: true });
const Attendance = mongoose_1.models.Attendance || (0, mongoose_1.model)("Attendance", AttendanceSchema);
exports.default = Attendance;
