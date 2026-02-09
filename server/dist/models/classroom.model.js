"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Classroom = void 0;
const mongoose_1 = require("mongoose");
const ClassroomSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    teacher: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    students: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    lectures: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Lecture",
        },
    ],
    isPaid: {
        type: Boolean,
        default: false,
    },
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
    joinCode: {
        type: String,
    },
    joinCodeExpiresAt: {
        type: Date,
        default: null,
    },
    currency: {
        type: String,
        required: function () {
            return this.isPaid;
        },
        default: "INR",
    },
    assignments: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Assignment",
        },
    ],
    exams: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Exam",
        },
    ],
}, { timestamps: true });
exports.Classroom = (0, mongoose_1.model)("Classroom", ClassroomSchema);
