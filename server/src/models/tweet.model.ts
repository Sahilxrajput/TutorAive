import mongoose, { models, Schema } from "mongoose";
import { ITweet } from "../types/type";

const tweetSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      max: [30, "can not post have more than 30 lettre letters in title"],
    },
    content: {
      type: String,
      required: true,
      trim: true,
      max: [500, "can not have more than 500 letters in content"],
    },
    type: {
      type: String,
      enum: ["general", "mentorship", "news", "problem"],
      default: "general",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    classroom: {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    reTweet: [{ type: Schema.Types.ObjectId, ref: "Tweet" }], //? @info
  },
  { timestamps: true }
);

const Tweet =
  models.tweetSchema || mongoose.model<ITweet>("Tweet", tweetSchema);
export default Tweet;
