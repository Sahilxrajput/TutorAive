import mongoose, { Schema, model, models, Document, Types } from "mongoose";
import { IClassSchedule } from "../types/type";


const classScheduleSchema = new Schema<IClassSchedule>(
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

const ClassSchedule =
  models.ClassSchedule ||
  model<IClassSchedule>("ClassSchedule", classScheduleSchema);
export default ClassSchedule;
