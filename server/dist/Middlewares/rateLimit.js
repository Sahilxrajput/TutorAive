"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentLimiter = exports.refreshLimiter = exports.authLimiter = exports.globalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const createRateLimiter = (windowMs, max, message) => {
    return (0, express_rate_limit_1.default)({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            message,
        },
    });
};
exports.globalLimiter = createRateLimiter(15 * 60 * 1000, // 15 minutes
600, // ~40 req/min average
"Too many requests. Please try again later.");
exports.authLimiter = createRateLimiter(15 * 60 * 1000, 15, "Too many authentication attempts. Try again later.");
exports.refreshLimiter = createRateLimiter(15 * 60 * 1000, 50, "Too many token refresh requests.");
exports.paymentLimiter = createRateLimiter(15 * 60 * 1000, 10, "Too many payment requests. Try again later.");
