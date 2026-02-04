import { Schema, model } from "mongoose";
import { IClassroom } from "../types/type";

const ClassroomSchema = new Schema<IClassroom>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
    isPaid: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      required: function (this: IClassroom) {
        return this.isPaid;
      },
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    currency: {
      type: String,
      required: function (this: IClassroom) {
        return this.isPaid;
      },
      default: "INR",
    },
    assignments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Assignment",
      },
    ],
    exams: [
      {
        type: Schema.Types.ObjectId,
        ref: "Exam",
      },
    ],
  },
  { timestamps: true },
);

export const Classroom = model<IClassroom>("Classroom", ClassroomSchema);
