// models/Attendance.ts
import { Schema, models, model, Types, Document } from "mongoose";
import { IAttendance } from "../types/type";



const AttendanceSchema = new Schema<IAttendance>({
  classroom: { type: Schema.Types.ObjectId, ref: "Classroom", required: true },
  student: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["present", "absent"], default: "present" },
});

AttendanceSchema.index({ classroom: 1, user: 1, date: 1 }, { unique: true });

const Attendance =
  models.Attendence || model<IAttendance>("Attendance", AttendanceSchema);

export default Attendance;
