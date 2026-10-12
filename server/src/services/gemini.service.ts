import {
  SummaryResult,
  QuizResult,
  QuizQuestion,
  GeminiResponse,
} from "../types/ai.types";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// ─── Core Gemini Caller ────────────────────────────────────────────────────

async function callGemini(prompt: string): Promise<string> {
  const response = await fetch(GEMINI_URL, {
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
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data: GeminiResponse = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error("Empty response from Gemini");
  return text;
}

// ─── Summary Generator ─────────────────────────────────────────────────────

export async function generateSummary(
  sessionId: string,
  transcript: string
): Promise<SummaryResult> {
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

  const raw = await callGemini(prompt);

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
}

// ─── Quiz Generator ────────────────────────────────────────────────────────

export async function generateQuiz(
  sessionId: string,
  transcript: string,
  questionCount: number = 5
): Promise<QuizResult> {
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

  const raw = await callGemini(prompt);
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned);

  const questions: QuizQuestion[] = parsed.questions.map(
    (q: QuizQuestion, i: number) => ({
      ...q,
      id: `q${i + 1}`,
    })
  );

  return {
    sessionId,
    questions,
    generatedAt: new Date(),
  };
}
