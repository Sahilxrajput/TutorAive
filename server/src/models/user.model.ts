import mongoose, { Schema, model, models, Types, Document } from "mongoose";
import { IUser } from "../types/type";

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    userName: {
      type: String,
      trim: true,
      unique: true,
      default: () => `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    },
    oauthProvider: {
      type: String,
      enum: ["google", "github", "facebook", "discord", null],
    },
    oauthId: {
      type: String,
      unique: false,
      sparse: true, // allows multiple docs with null
    },
    profilePicture: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: function (this: IUser) {
        return !this.oauthProvider;
      },
      select: false,
    },
    enrolledClassrooms: [
      {
        type: Types.ObjectId,
        ref: "Classroom",
      },
    ],
    assignments: [
      {
        type: Types.ObjectId,
        ref: "Assignment",
      },
    ],
    notes: [
      {
        type: Types.ObjectId,
        ref: "AssignmenNote",
      },
    ],
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to enforce unique (oauthProvider, oauthId)
userSchema.index(
  { oauthProvider: 1, oauthId: 1 },
  { unique: true, sparse: true }
);

const User = models.User || model<IUser>("User", userSchema);

export default User;
