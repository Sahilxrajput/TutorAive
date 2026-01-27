"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Classroom = void 0;
const mongoose_1 = require("mongoose");
const ClassroomSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    teacher: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    students: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    lectureIds: [{ type: String }], // Links to your live call logic
    isPaid: { type: Boolean, default: false },
    price: {
        type: Number,
        required: function () {
            return this.isPaid;
        },
    },
    status: {
        type: String,
        enum: ["active", "completed"],
        default: "active",
    },
    currency: { type: String, default: "INR" },
    assignments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Assignment" }],
    exams: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Exam" }],
}, { timestamps: true });
exports.Classroom = (0, mongoose_1.model)("Classroom", ClassroomSchema);
