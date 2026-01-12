// models/Attendance.ts
import { Schema, model, models } from "mongoose";
import { IAttendance } from "../types/type";

const AttendanceSchema = new Schema<IAttendance>(
  {
    classroom: {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
      index: true,
    },
    lecture: {
      type: Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
      index: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // normalized date (00:00 of the day)
    sessionDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["present", "absent"],
      default: "absent",
    },
    joinTime: Date,
    leaveTime: Date,

    markedBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // teacher/admin
    },
  },
  { timestamps: true }
);

// one attendance per student per class per lecture
AttendanceSchema.index(
  { classroom: 1, student: 1, lecture: 1 },
  { unique: true }
);

const Attendance =
  models.Attendance || model<IAttendance>("Attendance", AttendanceSchema);

export default Attendance;
