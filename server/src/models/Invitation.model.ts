import mongoose, { Schema, model, models, Document, Types } from "mongoose";

export interface IClassInvitation extends Document {
  classroom: Types.ObjectId;
  createdBy: Types.ObjectId;
  inviteCode: string; // short unique code
  expiresAt?: Date;
  maxUses?: number; // optional usage limit
  usedBy: Types.ObjectId[]; // track which users have used it
  createdAt: Date;
  updatedAt: Date;
}

const invitationSchema = new Schema<IClassInvitation>(
  {
    classroom: {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    inviteCode: { type: String, required: true, unique: true },
    expiresAt: Date,
    maxUses: { type: Number, default: 0 }, // maxUses = 0 means unlimited.
    usedBy: [{ type: Schema.Types.ObjectId, ref: "User" }], // array tracks who used the link.
  },
  { timestamps: true }
);

/* Automatically delete invitation 1 day (24h) after expiry
  MongoDB TTL (Time-To-Live) index will remove documents once (expiresAt + 24 hours) has passed.  */

invitationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 } // 24 hours
);

const Invitation =
  models.Invitation || model<IClassInvitation>("Invitation", invitationSchema);
export default Invitation;
