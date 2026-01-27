"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// models/Attendance.ts
const mongoose_1 = require("mongoose");
const AttendanceSchema = new mongoose_1.Schema({
    classroom: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Classroom",
        required: true,
        index: true,
    },
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
    // normalized date (00:00 of the day)
    sessionDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["present", "absent"],
        default: "absent",
    },
    joinTime: Date,
    leaveTime: Date,
    markedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User", // teacher/admin
    },
}, { timestamps: true });
// one attendance per student per class per lecture
AttendanceSchema.index({ classroom: 1, student: 1, lecture: 1 }, { unique: true });
const Attendance = mongoose_1.models.Attendance || (0, mongoose_1.model)("Attendance", AttendanceSchema);
exports.default = Attendance;
