"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.createOrder = void 0;
const razorpay_1 = require("../config/razorpay");
const crypto_1 = __importDefault(require("crypto"));
const payment_model_1 = require("../models/payment.model");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, classroomId, } = req.body;
        const options = {
            amount: amount * 100, // convert to paise
            currency: "INR",
            receipt: `rcpt_${Date.now()}`, //@todo create receipt
        };
        const order = yield razorpay_1.razorpay.orders.create(options);
        const data = yield payment_model_1.Payment.create({
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error });
    }
});
exports.createOrder = createOrder;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto_1.default
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "jgkuu")
        .update(body.toString())
        .digest("hex");
    if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false });
    }
    const data = yield payment_model_1.Payment.findOneAndUpdate({ orderId: razorpay_order_id }, {
        paymentId: razorpay_payment_id,
        status: "paid",
    });
    console.log("verify res : ", data);
    res.json({ success: true });
});
exports.verifyPayment = verifyPayment;
