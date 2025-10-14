"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const classScheduleSchema = new mongoose_1.Schema({
    classroom: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Classroom",
        required: true,
    },
    title: { type: String, required: true },
    description: String,
    startTime: { type: Date, required: true },
    endTime: Date,
    recurrenceRule: String, // optional iCalendar-style recurrence
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["scheduled", "completed", "cancelled"],
        default: "scheduled",
    },
}, { timestamps: true });
const ClassSchedule = mongoose_1.models.ClassSchedule ||
    (0, mongoose_1.model)("ClassSchedule", classScheduleSchema);
exports.default = ClassSchedule;
