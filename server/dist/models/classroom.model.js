"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const classroomSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    description: String,
    isPublic: { type: Boolean, default: false },
    joinCode: { type: String, index: true, unique: true }, // unique join code for classrooms
    tags: [{ type: String }],
    settings: {
        maxStudents: { type: Number, default: 100 },
        allowGuests: { type: Boolean, default: false },
        chatEnabled: { type: Boolean, default: true },
        codeEditorEnabled: { type: Boolean, default: true },
        canvasEnabled: { type: Boolean, default: true },
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    schedules: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "ClassSchedule" }],
    invitations: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Invitation" }],
    status: {
        type: String,
        enum: ["active", "archived", "deleted"],
        default: "active",
    },
    students: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "User",
        },
    ],
    assignments: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "Assignment",
        },
    ],
}, { timestamps: true });
// ✅ Create and export the model
const Classroom = mongoose_1.models.Classroom || (0, mongoose_1.model)("Classroom", classroomSchema);
exports.default = Classroom;
