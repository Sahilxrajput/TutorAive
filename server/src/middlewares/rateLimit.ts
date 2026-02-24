import rateLimit from "express-rate-limit";

const createRateLimiter = (windowMs: number, max: number, message: string) => {
  return rateLimit({
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

export const globalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  600, // ~40 req/min average
  "Too many requests. Please try again later.",
);

export const authLimiter = createRateLimiter(
  15 * 60 * 1000,
  15, 
  "Too many authentication attempts. Try again later.",
);

export const refreshLimiter = createRateLimiter(
  15 * 60 * 1000,
  50, 
  "Too many token refresh requests.",
);

export const paymentLimiter = createRateLimiter(
  15 * 60 * 1000,
  10,
  "Too many payment requests. Try again later.",
);
