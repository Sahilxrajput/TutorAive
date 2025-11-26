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
      type: Object,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pinnedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["active", "archived", "trashed"],
      default: "active",
    },
    trashedAt: {
      type: Date,
      default: null,
    },
    collaborators: {
      type: [
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
      default: [],
    },
    classroom: {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
    },
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
  if (
    this.isModified("status") &&
    this.status === "trashed" &&
    !this.trashedAt
  ) {
    this.trashedAt = new Date();
  }
  next();
});

// -------------------- Model Export --------------------
const Note = models.Note || model<INote>("Note", noteSchema);
export default Note;
