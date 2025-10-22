import mongoose, { Schema, Document } from "mongoose";
import { INote } from "../types/type";

const NoteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: "",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sharedWith: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    classroom: {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
    },
    date: {
      type: Date,
      default: Date.now, // captures the day of the note
    },
    module: {
      type: String,
      trim: true,
    },
    attachments: [
      {
        type: String, // can store file URLs if needed
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<INote>("Note", NoteSchema);
