"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("../controllers/payment.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = express_1.default.Router();
router.use(auth_middleware_1.default);
// Create an order
router.post("/create-order", payment_controller_1.createOrder);
// Verify payment
router.post("/verify", payment_controller_1.verifyPayment);
exports.default = router;
