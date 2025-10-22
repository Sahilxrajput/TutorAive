import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Enrollment from "../models/enrollment.model";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, courseId, userId } = req.body;

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Create pending enrollment
    const res = await Enrollment.create({
      user: userId,
      course: courseId,
      amount,
      orderId: order.id,
    });
    console.log("payment res :", res)
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false,  error });
  }
});

// Verify payment
router.post("/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET ||"jgkuu")
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    const res = await Enrollment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { status: "success", paymentId: razorpay_payment_id }
    );
    console.log("verify res : ",res)
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});

export default router;
