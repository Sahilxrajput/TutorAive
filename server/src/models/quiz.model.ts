// models/Quiz.js
import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
  text: String,
  isCorrect: Boolean,
});

const QuestionSchema = new mongoose.Schema({
  question: String,
  options: [OptionSchema],
});

const QuizSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  subject: { type: String, required: true },
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Quiz", QuizSchema);
