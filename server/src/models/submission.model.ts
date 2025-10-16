import { Schema, model, models, Document, Types } from "mongoose";
import { ISubmission } from "../types/type";



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
    content: String,
    grade: Number,
    feedback: String,
  },
  { timestamps: true }
);

submissionSchema.index({ assignment: 1, student: 1 }, { unique: true }); // only one submission per student per assignment

const Submission =
  models.Submission || model<ISubmission>("Submission", submissionSchema);
export default Submission;
