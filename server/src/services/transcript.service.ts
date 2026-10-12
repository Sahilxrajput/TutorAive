import mongoose, { Schema, Document, Model } from "mongoose";
import { SessionTranscript, TranscriptSegment } from "../types/ai.types";

// ─── Mongoose Schema ───────────────────────────────────────────────────────

export interface ITranscript extends Document {
  sessionId: string;
  segments: TranscriptSegment[];
  fullText: string;
  startedAt: Date;
  endedAt?: Date;
}

const TranscriptSchema = new Schema<ITranscript>({
  sessionId: { type: String, required: true, unique: true },
  segments: [
    {
      text: String,
      timestamp: Number,
      speaker: { type: String, default: "teacher" },
    },
  ],
  fullText: { type: String, default: "" },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
});

export const TranscriptModel: Model<ITranscript> =
  mongoose.models.Transcript ||
  mongoose.model<ITranscript>("Transcript", TranscriptSchema);

// ─── Service Functions ─────────────────────────────────────────────────────

// Append a new segment to the transcript (called from WebSocket handler)
export async function appendTranscriptSegment(
  sessionId: string,
  text: string,
  timestamp: number
): Promise<void> {
  const segment: TranscriptSegment = { text, timestamp, speaker: "teacher" };

  await TranscriptModel.findOneAndUpdate(
    { sessionId },
    {
      $push: { segments: segment },
      $set: { fullText: "" }, // will be rebuilt below
      $setOnInsert: { startedAt: new Date() },
    },
    { upsert: true, new: true }
  ).then(async (doc) => {
    if (doc) {
      // Rebuild fullText from all segments
      const fullText = doc.segments.map((s) => s.text).join(" ");
      await TranscriptModel.updateOne({ sessionId }, { $set: { fullText } });
    }
  });
}

// Mark transcript as ended
export async function endTranscript(sessionId: string): Promise<void> {
  await TranscriptModel.findOneAndUpdate(
    { sessionId },
    { $set: { endedAt: new Date() } }
  );
}

// Get full transcript for a session
export async function getTranscript(
  sessionId: string
): Promise<ITranscript | null> {
  return TranscriptModel.findOne({ sessionId });
}
