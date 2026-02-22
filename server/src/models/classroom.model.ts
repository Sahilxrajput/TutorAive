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
    thumbnail: {
      url: {
        type: String,
      },
      publicId:{
        type:String,
      }
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
    // lectures: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Lecture",
    //   },
    // ],
    // assignments: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Assignment",
    //   },
    // ],
    exams: [
      {
        type: Schema.Types.ObjectId,
        ref: "Exam",
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
    currency: {
      type: String,
      required: function (this: IClassroom) {
        return this.isPaid;
      },
      default: "INR",
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true },
);

ClassroomSchema.index({ teacher: 1 });

export const Classroom = model<IClassroom>("Classroom", ClassroomSchema);
