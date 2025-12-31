import mongoose, { Schema, model, models, Types, Document } from "mongoose";
import { IClassroom } from "../types/type";

const classroomSchema = new Schema<IClassroom>(
  {
    title: { type: String, required: true, trim: true },
    description: String,
    overview: {
      courseObjective: String,
      targetAudience: String,
      prerequisites: String,
      learningOutcomes: [String],
      duration: String,
      mode: {
        type: String,
        enum: ["online", "offline", "hybrid"],
        default: "online",
      },
      resources: [String], // links or references
    },
    curriculum: [
      {
        moduleTitle: String,
        moduleDescription: String,
        topics: [String],
        // assignments: [{ type: Schema.Types.ObjectId, ref: "Assignment" }],
        resources: [String],
      },
    ],
    syllabus: [
      {
        week: Number,
        topic: String,
        description: String,
        readingMaterials: [String],
        assignments: [{ type: Schema.Types.ObjectId, ref: "Assignment" }],
      },
    ],
    // rawData: Schema.Types.Mixed, // flexible raw JSON data for any extra info

    isPublic: { type: Boolean, default: false },
    joinCode: { type: String, index: true, unique: true },
    tags: [{ type: String }],
    modules: {
      type: Number,
      default: 8,
    },
    hours: {
      type: Number,
      default: 8,
    },
    price: {
      type: Number,
      required: function (this: IClassroom) {
        return this.paid;
      },
    },
    settings: {
      maxStudents: { type: Number, default: 100 },
      allowGuests: { type: Boolean, default: true },
      chatEnabled: { type: Boolean, default: true },
      codeEditorEnabled: { type: Boolean, default: true },
      canvasEnabled: { type: Boolean, default: true },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    schedules: [{ type: Schema.Types.ObjectId, ref: "ClassSchedule" }],
    invitations: [{ type: Schema.Types.ObjectId, ref: "Invitation" }],
    attendance: [{ type: Schema.Types.ObjectId, ref: "Attendance" }],
    status: {
      type: String,
      enum: ["active", "archived", "deleted"],
      default: "active",
    },
    students: [{ type: Types.ObjectId, ref: "User" }],
    // assignments: [{ type: Types.ObjectId, ref: "Assignment" }],
    paid: { type: Boolean, default: false },
    memberships: [{ type: Types.ObjectId, ref: "Membership" }],
  },
  { timestamps: true }
);

const Classroom =
  models.Classroom || model<IClassroom>("Classroom", classroomSchema);
export default Classroom;
