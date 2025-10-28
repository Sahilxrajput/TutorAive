import mongoose, { model, models, Schema } from "mongoose";
import { INote } from "../types/type";

// -------------------- Schema Definition --------------------
const noteSchema = new Schema<INote>(
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
    color: {
      type: String,
      default: "#ffffff",
    },
    visibility: {
      type: String,
      enum: ["private", "public", "classroom"],
      default: "private",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pinnedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "archived", "trashed"],
      default: "active",
      required: true,
    },
    trashedAt: {
      type: Date,
      default: null,
    },
    collaborators: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        access: {
          type: String,
          enum: ["view", "edit"],
          default: "view",
        },
      },
    ],
    classroom: {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
    },
    attachments: [
      {
        type: String, // file URL or path
      },
    ],
  },
  {
    timestamps: true, 
  }
);

// -------------------- Indexes --------------------
noteSchema.index({ owner: 1, status: 1 });
noteSchema.index({ title: "text", content: "text" });

// -------------------- Middleware --------------------
noteSchema.pre("save", function (next) {
  // Automatically set trashedAt when status becomes 'trashed'
  if (this.isModified("status") && this.status === "trashed" && !this.trashedAt) {
    this.trashedAt = new Date();
  }
  next();
});

// -------------------- Model Export --------------------
const Note = models.Note || model<INote>("Note", noteSchema);
export default Note;
