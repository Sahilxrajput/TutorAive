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
    file: {
        url: String,
        public_id: String,
        resource_type: String,
    },
    status: {
        type: String,
        enum: ["submitted", "graded"],
        default: "submitted",
    },
    content: String,
    marks: { type: Number, max: 100, default: 0 },
    feedback: String,
}, { timestamps: true });
// only one submission per student per assignment
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });
const Submission = mongoose_1.models.Submission || (0, mongoose_1.model)("Submission", submissionSchema);
exports.default = Submission;
