// import { Request, Response } from "express";
// import { GoogleGenAI } from "@google/genai";

// const { GEMINI_API_KEY } = process.env;
// const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// async function generateContent(prompt: string) {
//   try {
//     const res = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//     });
//     console.log(res.text);
//     return res.text || "⚠️ No response.";
//   } catch (err: any) {
//     console.error("Gemini API error:", err);
//     if (err.status === 503) {
//       return "🚧 The AI service is overloaded/unavailable. Please try again later.";
//     }
//     return "❌ An unexpected error occurred while generating content.";
//   }
// }

// const generateQuizs = async (req: Request, res: Response) => {
//   try {
//     const { topic, subject, numQuestions, numOptions } = req.body;

//     if (!topic || !subject || !numQuestions || !numOptions) {
//       return res.json({ message: "All fields are required" });
//     }

//     // Gemini API request
//     const prompt = `Generate a ${numQuestions}-question multiple-choice quiz on the topic "${topic}" and subject "${subject}".
//     Each question should have ${numOptions} options with the correct answer marked. Return JSON format with questions and options.`;
//     let data: string | undefined = "";
//     try {
//       const res = await ai.models.generateContent({
//         model: "gemini-2.5-flash",
//         contents: [{ role: "user", parts: [{ text: prompt }] }],
//       });
//       data = res.text;
//       console.log(res.text);
//     } catch (err: any) {
//       console.error("Gemini API error:", err);
//       if (err.status === 503) {
//         console.log(
//           "🚧 The AI service is overloaded/unavailable. Please try again later."
//         );
//       }
//       console.log("❌ An unexpected error occurred while generating content.");
//     }

//     // Save to DB
//     // const quiz = new Quiz({
//     //   topic,
//     //   subject,
//     //   questions: parsedQuiz.questions,
//     // });

//     // await quiz.save();

//     res.json({ message: "Quiz generated successfully", data });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error generating quiz", error: error });
//   }
// };

// export { generateQuizs };

import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { parseQuizData } from "../utils/parseQuizData";

const { GEMINI_API_KEY } = process.env;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function generateContent(prompt: string): Promise<string> {
  try {
    const aiRes = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    return aiRes.text || "⚠️ No response.";
  } catch (err: any) {
    console.error("Gemini API error:", err);
    if (err.status === 503) {
      return "🚧 The AI service is overloaded/unavailable. Please try again later.";
    }
    return "❌ An unexpected error occurred while generating content.";
  }
}

const generateQuizs = async (req: Request, res: Response) => {
  try {
    // const { topic, subject, numQuestions, numOptions } = req.body;

    // if (!topic || !subject || !numQuestions || !numOptions) {
    //   return res.status(400).json({ message: "All fields are required" });
    // }
    const subject = "computer science";
    const topic = "react";
    const numQuestions = "5";
    const numOptions = "4";

    const prompt = `Generate a ${numQuestions}-question multiple-choice quiz on the topic "${topic}" and subject "${subject}". 
Each question should have ${numOptions} options with the correct answer marked. Return JSON DATA with Options`;

    // Call Gemini API
    const data = await generateContent(prompt);
    // Parse Data
    const str = await parseQuizData(data);
    res.json(str);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating quiz", error });
  }
};

export { generateQuizs };
