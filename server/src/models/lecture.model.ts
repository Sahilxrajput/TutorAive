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
    recurrenceRule: String, // optional iCalendar-style recurrence
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

const Lecture =
  models.lectureSession || model<ILecture>("Lecture", lectureSession);
export default Lecture;
