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
const express_1 = require("express");
const gemini_service_1 = require("../services/gemini.service");
const transcript_service_1 = require("../services/transcript.service");
const router = (0, express_1.Router)();
// ─── POST /api/ai/transcript/append ───────────────────────────────────────
// Called from WebSocket handler to save transcript segments
router.post("/transcript/append", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionId, text, timestamp } = req.body;
        if (!sessionId || !text) {
            return res.status(400).json({ error: "sessionId and text are required" });
        }
        yield (0, transcript_service_1.appendTranscriptSegment)(sessionId, text, timestamp !== null && timestamp !== void 0 ? timestamp : Date.now());
        res.json({ success: true });
    }
    catch (err) {
        console.error("Transcript append error:", err);
        res.status(500).json({ error: "Failed to save transcript segment" });
    }
}));
// ─── POST /api/ai/transcript/end ──────────────────────────────────────────
// Called when session ends to mark transcript complete
router.post("/transcript/end", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionId } = req.body;
        if (!sessionId)
            return res.status(400).json({ error: "sessionId required" });
        yield (0, transcript_service_1.endTranscript)(sessionId);
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to end transcript" });
    }
}));
// ─── GET /api/ai/transcript/:sessionId ────────────────────────────────────
// Get full transcript for a session
router.get("/transcript/:sessionId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionId } = req.params;
        const transcript = yield (0, transcript_service_1.getTranscript)(sessionId);
        if (!transcript) {
            return res.status(404).json({ error: "Transcript not found" });
        }
        res.json(transcript);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch transcript" });
    }
}));
// ─── POST /api/ai/summary ─────────────────────────────────────────────────
// Generate AI summary from session transcript
router.post("/summary", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionId } = req.body;
        if (!sessionId)
            return res.status(400).json({ error: "sessionId required" });
        const transcript = yield (0, transcript_service_1.getTranscript)(sessionId);
        if (!transcript || !transcript.fullText) {
            return res.status(404).json({ error: "No transcript found for this session" });
        }
        const summary = yield (0, gemini_service_1.generateSummary)(sessionId, transcript.fullText);
        res.json(summary);
    }
    catch (err) {
        console.error("Summary generation error:", err);
        res.status(500).json({ error: "Failed to generate summary" });
    }
}));
// ─── POST /api/ai/quiz ────────────────────────────────────────────────────
// Generate AI quiz from session transcript
router.post("/quiz", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionId, questionCount = 5 } = req.body;
        if (!sessionId)
            return res.status(400).json({ error: "sessionId required" });
        const transcript = yield (0, transcript_service_1.getTranscript)(sessionId);
        if (!transcript || !transcript.fullText) {
            return res.status(404).json({ error: "No transcript found for this session" });
        }
        const quiz = yield (0, gemini_service_1.generateQuiz)(sessionId, transcript.fullText, questionCount);
        res.json(quiz);
    }
    catch (err) {
        console.error("Quiz generation error:", err);
        res.status(500).json({ error: "Failed to generate quiz" });
    }
}));
exports.default = router;
