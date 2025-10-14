import mongoose, { Schema, model, models, Document, Types } from "mongoose";

export interface IClassSchedule extends Document {
  classroom: Types.ObjectId;
  title: string;
  description?: string;
  startTime: Date; // first session start
  endTime?: Date; // optional end time for the first session
  recurrenceRule?: string; // e.g., "RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR"
  createdBy: Types.ObjectId;
  status: "scheduled" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

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
