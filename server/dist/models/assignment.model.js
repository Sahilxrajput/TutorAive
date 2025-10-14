"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const assignmentSchema = new mongoose_1.Schema({
    classroom: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Classroom",
        required: true,
    },
    title: { type: String, required: true },
    description: String,
    dueDate: { type: Date, required: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    maxPoints: { type: Number, default: 100 },
}, { timestamps: true });
const Assignment = mongoose_1.models.Assignment || (0, mongoose_1.model)("Assignment", assignmentSchema);
exports.default = Assignment;
