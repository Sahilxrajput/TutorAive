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
    status: {
      type: String,
      enum: ["submitted", "checked"],
      default: "submitted",
    },
    content: String,
    marks: { type: Number, max: 100, default: 0 },

    feedback: String,
  },
  { timestamps: true }
);

// only one submission per student per assignment
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

const Submission =
  models.Submission || model<ISubmission>("Submission", submissionSchema);
export default Submission;
