import { Router } from "express";
import mongoose from "mongoose";
import Redis from "ioredis";

const router = Router();
const redis = new Redis(process.env.REDIS_URL!);

router.get("/", async (_req, res) => {
  const mongoState = mongoose.connection.readyState === 1;
  const redisState = redis.status === "ready";

  const isHealthy = mongoState && redisState;

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "ok" : "degraded",
    services: {
      mongo: mongoState ? "connected" : "down",
      redis: redisState ? "connected" : "down",
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
