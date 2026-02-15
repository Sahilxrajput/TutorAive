// models/Attendance.ts
import { Schema, model, models } from "mongoose";
import { IAttendance } from "../types/type";

const AttendanceSchema = new Schema<IAttendance>(
  {
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

    status: {
      type: String,
      enum: ["present", "absent", "late"],
      default: "absent",
      required: true,
    },
    joinTime: Date,
    leaveTime: Date,
    markedAt:Date,
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // teacher/admin
    },
  },
  { timestamps: true },
);

// one attendance per student per class per lecture
AttendanceSchema.index(
  { student: 1, lecture: 1 },
  { unique: true }
);

const Attendance =
  models.Attendance || model<IAttendance>("Attendance", AttendanceSchema);

export default Attendance;
