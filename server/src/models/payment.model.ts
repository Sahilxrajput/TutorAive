import { Schema, model, models } from "mongoose";
import { IPayment } from "../types/type";

const paymentSchema = new Schema<IPayment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    classroom: {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
    },
    orderId: String,
    paymentId: String,
    amount: Number,
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
  },
  { timestamps: true },
);

const payment = models.Payment || model<IPayment>("Payment", paymentSchema);

export default payment;
