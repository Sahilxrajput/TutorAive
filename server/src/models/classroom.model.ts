import mongoose, { Schema, model, models, Types, Document } from "mongoose";

export interface IClassroom extends Document {
  title: string;
  description?: string;
  isPublic: boolean;
  createdBy: Types.ObjectId;
  joinCode: string;
  tags: string[];
  students?: Types.ObjectId[];
  assignments?: Types.ObjectId[];
  schedules?: Types.ObjectId[];
  invitations?: Types.ObjectId[];
  status: "active" | "archived" | "deleted";
  settings?: {
    maxStudents: number;
    allowGuests: boolean;
    chatEnabled: boolean;
    codeEditorEnabled: boolean;
    canvasEnabled: boolean;
  };
}

const classroomSchema = new Schema<IClassroom>(
  {
    title: { type: String, required: true, trim: true },
    description: String,
    isPublic: { type: Boolean, default: false },
    joinCode: { type: String, index: true, unique: true }, // unique join code for classrooms
    tags: [{ type: String }],

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
    status: {
      type: String,
      enum: ["active", "archived", "deleted"],
      default: "active",
    },

    students: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    assignments: [
      {
        type: Types.ObjectId,
        ref: "Assignment",
      },
    ],
  },
  { timestamps: true }
);

const Classroom =
  models.Classroom || model<IClassroom>("Classroom", classroomSchema);
export default Classroom;
