import { Schema, model, models, Document, Types } from "mongoose";

export interface ISubmission extends Document {
  assignment: Types.ObjectId;
  student: Types.ObjectId;
  submittedAt: Date;
  files?: string[]; // array of file URLs
  grade?: number; // optional grade
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const submissionSchema = new Schema<ISubmission>(
  {
    assignment: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    submittedAt: { type: Date, default: Date.now },
    files: [{ type: String }],
    grade: Number,
    feedback: String,
  },
  { timestamps: true }
);

submissionSchema.index({ assignment: 1, student: 1 }, { unique: true }); // only one submission per student per assignment

const Submission =
  models.Submission || model<ISubmission>("Submission", submissionSchema);
export default Submission;
