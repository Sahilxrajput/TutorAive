import { model, models, Schema, Types } from "mongoose";

const paymentSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    classroom: { type: Types.ObjectId, ref: "Classroom", required: true },

    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    provider: {
      type: String,
      enum: ["razorpay", "stripe"],
      required: true,
      default: "razorpay"
    },

    orderId: String,
    paymentId: String,
    signature: String,

    status: {
      type: String,
      enum: ["created", "paid", "failed", "refunded"],
      default: "created",
    },
  },
  { timestamps: true },
);

export const Payment = models.Payment || model("Payment", paymentSchema);
