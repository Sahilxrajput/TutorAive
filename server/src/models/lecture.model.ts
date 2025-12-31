import mongoose, { Schema, model, models, Document, Types } from "mongoose";
import { ILecture } from "../types/type";

const lectureSession = new Schema<ILecture>(
  {
    classroom: {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },

    title: { type: String, required: true },
    description: String,

    startTime: { type: Date, required: true },
    endTime: Date,

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recurrenceRule: String, // optional iCalendar-style recurrence

    delayReason: {
      type: String,
    },

    cancelReason: {
      type: String,
    },

    status: {
      type: String,
      enum: [
        "scheduled",
        "rescheduled",
        "delayed",
        "live",
        "completed",
        "cancelled",
      ],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

const Lecture =
  models.lectureSession || model<ILecture>("Lecture", lectureSession);
export default Lecture;
