import mongoose, { models, Schema } from "mongoose";
import { ITweet } from "../types/type";

const tweetSchema = new Schema<ITweet>(
  {
    content: {
      type: String,
      trim: true,
      max: [500, "can not have more than 500 letters in content"],
      required: function (this: ITweet) {
        return !this.parentTweet;
      },
    },
    type: {
      type: String,
      enum: ["general", "mentorship", "news", "problem", "repost"],
      default: "general",
    },
    mentions: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      url: String,
      public_id: String,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    parentTweet: { type: Schema.Types.ObjectId, ref: "Tweet" }, //? @info
  },
  { timestamps: true }
);

const Tweet =
  models.tweetSchema || mongoose.model<ITweet>("Tweet", tweetSchema);
export default Tweet;
