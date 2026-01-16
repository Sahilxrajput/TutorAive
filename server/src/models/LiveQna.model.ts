import { Schema, model, models } from "mongoose";

const LiveQnaSchema = new Schema(
  {
    lecture: {
      type: Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
    },
    questionBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      default: null,
    },
    answeredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isAnswered: {
      type: Boolean,
      default: false,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const LiveQna = models.LiveQna || model("LiveQna", LiveQnaSchema);
