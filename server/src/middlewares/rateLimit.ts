import rateLimit from "express-rate-limit";

const createRateLimiter = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    limit: max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message,
    },
  });
};

export const globalLimiter = createRateLimiter(
  15 * 60 * 1000,
  150,
  "Too many requests. Please try again later.",
);

export const authLimiter = createRateLimiter(
  15 * 60 * 1000,
  20,
  "Too many auth attempts. Try again later.",
);

export const paymentLimiter = createRateLimiter(
  10 * 60 * 1000,
  10,
  "Too many payment requests. Try again later.",
);
