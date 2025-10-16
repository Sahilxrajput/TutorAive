import mongoose, { Schema, model, Types, models, Document } from "mongoose";
import { IVideoSession } from "../types/type";

const VideoSessionSchema = new Schema<IVideoSession>(
  {
    classroom: {
      type: Types.ObjectId,
      ref: "Classroom",
      required: true,
      index: true,
    },
    title: String,
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    startedAt: Date,
    endedAt: Date,
    provider: { type: String, default: "webrtc" },
    providerRoomId: { type: String, index: true },
    participants: [
      {
        user: { type: Types.ObjectId, ref: "User" },
        joinAt: { type: Date, default: Date.now },
        leaveAt: Date,
        role: {
          type: String,
          enum: ["student", "instructor", "admin"],
          default: "student",
        },
      },
    ],
    isRecorded: { type: Boolean, default: false },
    meta: Schema.Types.Mixed, // extra metadata for a video session (meta: { resolution: '1080p', fps: 30 })
  },
  { timestamps: true }
);

const VideoSession =
  models.VideoSession || model("VideoSession", VideoSessionSchema);
export default VideoSession;
