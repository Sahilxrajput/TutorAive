import mongoose, { model, models } from "mongoose";
import { IEnrollment } from "../types/type";

const enrollmentSchema = new mongoose.Schema<IEnrollment>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    paymentId: String,
    orderId: String,
    amount: Number,
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Enrollment = models.Enrollment || model("Enrollment", enrollmentSchema);
export default Enrollment;
