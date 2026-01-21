import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Enrollment from "../models/enrollment.model";
import { razorpay } from "../config/razorpay";
import { Payment } from "../models/payment.model";
import { createOrder, verifyPayment } from "../controllers/payment.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

// Create an order
router.post("/create-order", createOrder);

// Verify payment
router.post("/verify", verifyPayment);

export default router;
