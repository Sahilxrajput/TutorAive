import { Socket } from "socket.io";
import {
  appendTranscriptSegment,
  endTranscript,
} from "../services/transcript.service";

export function registerTranscriptSocket(socket: Socket) {
  // ── Teacher sends a transcript chunk ────────────────────────────────────
  socket.on(
    "transcript:teacher-chunk",
    async (payload: {
      roomId: string;
      text: string;
      interim: string;
      timestamp: number;
    }) => {
      const { roomId, text, interim, timestamp } = payload;
        console.log("transcribe payload : ", payload)
      if (!roomId || !text) return;

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
    },
  );

  // ── Teacher ends the session → finalize transcript ───────────────────────
  socket.on("transcript:end", async (payload: { roomId: string }) => {
    const { roomId } = payload;
    if (!roomId) return;

    try {
      await endTranscript(roomId);
      console.log(`[Transcript] Session ${roomId} transcript finalized.`);
    } catch (err) {
      console.error("[Transcript] Failed to end transcript:", err);
    }
  });
}
