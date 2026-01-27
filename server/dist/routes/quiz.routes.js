"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quiz_controller_1 = require("../controllers/quiz.controller");
const router = (0, express_1.Router)();
router.get("/generate", quiz_controller_1.generateQuizs);
router.get("/get", quiz_controller_1.generateQuizs);
// GET all quizzes
// router.get("/", async (req, res) => {
//   try {
//     const quizzes = await Quiz.find().sort({ createdAt: -1 });
//     res.json(quizzes);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching quizzes" });
//   }
// });
exports.default = router;
