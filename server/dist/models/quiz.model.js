"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/Quiz.js
const mongoose_1 = __importDefault(require("mongoose"));
const OptionSchema = new mongoose_1.default.Schema({
    text: String,
    isCorrect: Boolean,
});
const QuestionSchema = new mongoose_1.default.Schema({
    question: String,
    options: [OptionSchema],
});
const QuizSchema = new mongoose_1.default.Schema({
    topic: { type: String, required: true },
    subject: { type: String, required: true },
    questions: [QuestionSchema],
    createdAt: { type: Date, default: Date.now },
});
exports.default = mongoose_1.default.model("Quiz", QuizSchema);
