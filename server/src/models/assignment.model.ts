import { Schema, model, models, Document, Types } from "mongoose";
import { IAssignment } from "../types/type";

const assignmentSchema = new Schema<IAssignment>(
  {
    classroom: {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    dueDate: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    file: {
      url: String,
      public_id: String,
      resource_type: String,
    },
    maxPoints: { type: Number, default: 100 },
  },
  { timestamps: true }
);

const Assignment =
  models.Assignment || model<IAssignment>("Assignment", assignmentSchema);
export default Assignment;
