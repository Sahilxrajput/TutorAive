"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Types.ObjectId, ref: "User", required: true },
    classroom: { type: mongoose_1.Types.ObjectId, ref: "Classroom", required: true },
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
}, { timestamps: true });
exports.Payment = mongoose_1.models.Payment || (0, mongoose_1.model)("Payment", paymentSchema);
