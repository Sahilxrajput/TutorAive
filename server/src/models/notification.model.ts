import { Schema, model, models } from "mongoose";
import { INotification } from "../types/type";

const NotificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["lecture", "assignment", "message", "resource", "system"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      classroomId: { type: Schema.Types.ObjectId, ref: "Classroom" },
      tweetId: { type: Schema.Types.ObjectId, ref: "Tweet" },
      lectureId: { type: Schema.Types.ObjectId, ref: "Lecture" },
      assignmentId: { type: Schema.Types.ObjectId, ref: "Assignment" },
      reason:String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Notification =
  models.Notification ||
  model<INotification>("Notification", NotificationSchema);
