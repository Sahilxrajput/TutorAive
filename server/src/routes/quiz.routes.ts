import { Router } from "express";
import { generateQuizs } from "../controllers/quiz.controller";

const router = Router();



router.get("/generate", generateQuizs);

// GET all quizzes
// router.get("/", async (req, res) => {
//   try {
//     const quizzes = await Quiz.find().sort({ createdAt: -1 });
//     res.json(quizzes);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching quizzes" });
//   }
// });

export default router;
