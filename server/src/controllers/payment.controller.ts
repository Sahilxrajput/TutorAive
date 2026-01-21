import { Response, Request } from "express";
import { razorpay } from "../config/razorpay";
import crypto from "crypto";
import { Payment } from "../models/payment.model";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, classroomId,  } = req.body;

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`, //@todo create receipt
    };

    const order = await razorpay.orders.create(options);

    const data = await Payment.create({
      user: req.userId,
      classroom: classroomId,
      orderId: order.id,
      amount,
    });

    // Create pending enrollment
    // const res = await Enrollment.create({
    //   user: userId,
    //   course: courseId,
    //   amount,
    //   orderId: order.id,
    // });
    // console.log("payment res :", data);
    console.log("payment order :", order);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "jgkuu")
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false });
  }

  const data = await Payment.findOneAndUpdate(
    { orderId: razorpay_order_id },
    {
      paymentId: razorpay_payment_id,
      status: "paid",
    },
  );

  console.log("verify res : ", data);
  res.json({ success: true });
};
