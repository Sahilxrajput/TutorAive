"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSummary = generateSummary;
exports.generateQuiz = generateQuiz;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
// ─── Core Gemini Caller ────────────────────────────────────────────────────
function callGemini(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        const response = yield fetch(GEMINI_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.4,
                    maxOutputTokens: 2048,
                },
            }),
        });
        if (!response.ok) {
            const error = yield response.text();
            throw new Error(`Gemini API error: ${response.status} - ${error}`);
        }
        const data = yield response.json();
        const text = (_e = (_d = (_c = (_b = (_a = data.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text;
        if (!text)
            throw new Error("Empty response from Gemini");
        return text;
    });
}
// ─── Summary Generator ─────────────────────────────────────────────────────
function generateSummary(sessionId, transcript) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!transcript || transcript.trim().length < 20) {
            throw new Error("Transcript is too short to summarize");
        }
        const prompt = `
You are an AI assistant that summarizes educational lectures.

Below is a transcript from a live teaching session. Analyze it and return a JSON response ONLY — no markdown, no explanation, just raw JSON.

Transcript:
"""
${transcript}
"""

Return this exact JSON structure:
{
  "title": "A short descriptive title for this lecture (max 10 words)",
  "overview": "A 2-3 sentence overview of what was taught",
  "keyPoints": ["key point 1", "key point 2", "key point 3", "...up to 6 points"],
  "topicsCovered": ["topic 1", "topic 2", "..."]
}
`;
        const raw = yield callGemini(prompt);
        // Strip markdown code fences if present
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return {
            sessionId,
            title: parsed.title,
            overview: parsed.overview,
            keyPoints: parsed.keyPoints,
            topicsCovered: parsed.topicsCovered,
            generatedAt: new Date(),
        };
    });
}
// ─── Quiz Generator ────────────────────────────────────────────────────────
function generateQuiz(sessionId_1, transcript_1) {
    return __awaiter(this, arguments, void 0, function* (sessionId, transcript, questionCount = 5) {
        if (!transcript || transcript.trim().length < 20) {
            throw new Error("Transcript is too short to generate a quiz");
        }
        const prompt = `
You are an AI assistant that creates educational quizzes from lecture transcripts.

Below is a transcript from a live teaching session. Generate exactly ${questionCount} multiple choice questions based on it.
Return a JSON response ONLY — no markdown, no explanation, just raw JSON.

Transcript:
"""
${transcript}
"""

Return this exact JSON structure:
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of why this answer is correct"
    }
  ]
}

Rules:
- correctAnswer is the index (0-3) of the correct option
- Make questions based strictly on the transcript content
- Keep questions clear and educational
`;
        const raw = yield callGemini(prompt);
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        const questions = parsed.questions.map((q, i) => (Object.assign(Object.assign({}, q), { id: `q${i + 1}` })));
        return {
            sessionId,
            questions,
            generatedAt: new Date(),
        };
    });
}
