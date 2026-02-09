import { Schema, model, models } from "mongoose";
import { ISubmission } from "../types/type";

const submissionSchema = new Schema<ISubmission>(
  {
    assignment: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    file: {
      url: String,
      public_id: String,
      resource_type: String,
    },
    status: {
      type: String,
      enum: ["submitted", "graded"],
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
