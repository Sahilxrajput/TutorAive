"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveQna = void 0;
const mongoose_1 = require("mongoose");
const LiveQnaSchema = new mongoose_1.Schema({
    lecture: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Lecture",
        required: true,
    },
    questionBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    question: {
        type: String,
        required: true,
        trim: true,
    },
    answer: {
        type: String,
        default: null,
    },
    answeredBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    isAnswered: {
        type: Boolean,
        default: false,
    },
    upvotes: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
exports.LiveQna = mongoose_1.models.LiveQna || (0, mongoose_1.model)("LiveQna", LiveQnaSchema);
