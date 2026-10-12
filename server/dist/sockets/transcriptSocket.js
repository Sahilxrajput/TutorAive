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
exports.registerTranscriptSocket = registerTranscriptSocket;
const transcript_service_1 = require("../services/transcript.service");
function registerTranscriptSocket(socket) {
    // ── Teacher sends a transcript chunk ────────────────────────────────────
    socket.on("transcript:teacher-chunk", (payload) => __awaiter(this, void 0, void 0, function* () {
        const { roomId, text, interim, timestamp } = payload;
        console.log("transcribe payload : ", payload);
        if (!roomId || !text)
            return;
        // 1. Save final text to MongoDB
        //   try {
        //     await appendTranscriptSegment(roomId, text, timestamp ?? Date.now());
        //   } catch (err) {
        //     console.error("[Transcript] Failed to save segment:", err);
        //   }
        // 2. Broadcast to all OTHER clients in the room (the students)
        socket.to(roomId).emit("transcript:chunk", {
            text, // final confirmed text
            interim, // live interim text (may be empty string)
        });
    }));
    // ── Teacher ends the session → finalize transcript ───────────────────────
    socket.on("transcript:end", (payload) => __awaiter(this, void 0, void 0, function* () {
        const { roomId } = payload;
        if (!roomId)
            return;
        try {
            yield (0, transcript_service_1.endTranscript)(roomId);
            console.log(`[Transcript] Session ${roomId} transcript finalized.`);
        }
        catch (err) {
            console.error("[Transcript] Failed to end transcript:", err);
        }
    }));
}
