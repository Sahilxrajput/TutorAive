import { Router, Request, Response } from "express";
import { generateSummary, generateQuiz } from "../services/gemini.service";
import {
  getTranscript,
  appendTranscriptSegment,
  endTranscript,
} from "../services/transcript.service";


const router = Router();

// ─── POST /api/ai/transcript/append ───────────────────────────────────────
// Called from WebSocket handler to save transcript segments
router.post("/transcript/append", async (req: Request, res: Response) => {
  try {
    const { sessionId, text, timestamp } = req.body;

    if (!sessionId || !text) {
      return res.status(400).json({ error: "sessionId and text are required" });
    }

    await appendTranscriptSegment(sessionId, text, timestamp ?? Date.now());
    res.json({ success: true });
  } catch (err) {
    console.error("Transcript append error:", err);
    res.status(500).json({ error: "Failed to save transcript segment" });
  }
});

// ─── POST /api/ai/transcript/end ──────────────────────────────────────────
// Called when session ends to mark transcript complete
router.post("/transcript/end", async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: "sessionId required" });

    await endTranscript(sessionId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to end transcript" });
  }
});

// ─── GET /api/ai/transcript/:sessionId ────────────────────────────────────
// Get full transcript for a session
router.get("/transcript/:sessionId", async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const transcript = await getTranscript(sessionId as string);

    if (!transcript) {
      return res.status(404).json({ error: "Transcript not found" });
    }

    res.json(transcript);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transcript" });
  }
});

// ─── POST /api/ai/summary ─────────────────────────────────────────────────
// Generate AI summary from session transcript
router.post("/summary", async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: "sessionId required" });

    const transcript = await getTranscript(sessionId);
    if (!transcript || !transcript.fullText) {
      return res.status(404).json({ error: "No transcript found for this session" });
    }

    const summary = await generateSummary(sessionId, transcript.fullText);
    res.json(summary);
  } catch (err) {
    console.error("Summary generation error:", err);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

// ─── POST /api/ai/quiz ────────────────────────────────────────────────────
// Generate AI quiz from session transcript
router.post("/quiz", async (req: Request, res: Response) => {
  try {
    const { sessionId, questionCount = 5 } = req.body;
    if (!sessionId) return res.status(400).json({ error: "sessionId required" });

    const transcript = await getTranscript(sessionId);
    if (!transcript || !transcript.fullText) {
      return res.status(404).json({ error: "No transcript found for this session" });
    }

    const quiz = await generateQuiz(sessionId, transcript.fullText, questionCount);
    res.json(quiz);
  } catch (err) {
    console.error("Quiz generation error:", err);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

export default router;
