import { Schema, model, models, Document, Types } from "mongoose";

export interface IAssignment extends Document {
  classroom: Types.ObjectId;
  title: string;
  description?: string;
  dueDate: Date;
  createdBy: Types.ObjectId;
  maxPoints?: number;
  createdAt: Date;
  updatedAt: Date;
}

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
    maxPoints: { type: Number, default: 100 },
  },
  { timestamps: true }
);

const Assignment =
  models.Assignment || model<IAssignment>("Assignment", assignmentSchema);
export default Assignment;
