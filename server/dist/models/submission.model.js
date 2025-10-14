"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const submissionSchema = new mongoose_1.Schema({
    assignment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Assignment",
        required: true,
    },
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    submittedAt: { type: Date, default: Date.now },
    files: [{ type: String }],
    grade: Number,
    feedback: String,
}, { timestamps: true });
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true }); // only one submission per student per assignment
const Submission = mongoose_1.models.Submission || (0, mongoose_1.model)("Submission", submissionSchema);
exports.default = Submission;
