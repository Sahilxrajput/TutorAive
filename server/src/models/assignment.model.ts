import { Schema, model, models, Document, Types } from "mongoose";
import { IAssignment } from "../types/type";

const assignmentSchema = new Schema<IAssignment>(
  {
    classroom: {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },
    title: { type: String, required: true },
    description: String,
    dueDate: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    attachment: { type: String },
    status: {
      type: String,
      enum: ["pending", "submitted"],
      default: "pending",
      required: true,
    },
    maxPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Assignment =
  models.Assignment || model<IAssignment>("Assignment", assignmentSchema);
export default Assignment;







