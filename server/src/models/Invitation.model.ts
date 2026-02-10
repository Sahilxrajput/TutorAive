import { Schema, model, models } from "mongoose";
import { IClassInvitation } from "../types/type";


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
    inviteCode: { 
        type: String, 
        required: true, 
        unique: true 
    },
    expiresAt: Date,
    maxUses: { type: Number, default: 0 }, // maxUses = 0 means unlimited.
    usedBy: [{ type: Schema.Types.ObjectId, ref: "User" }], // array tracks who used the link.
  },
  { timestamps: true }
);

invitationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 3 } // 3 days
);

const Invitation =
  models.Invitation || model<IClassInvitation>("Invitation", invitationSchema);
export default Invitation;
