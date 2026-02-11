import { Request, Response, Router } from "express";
import mongoose from "mongoose";
import Redis from "ioredis";

const redisClient = new Redis(
  process.env.REDIS_URL ?? "redis://localhost:6379",
);

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const healthStatus = {
    server: "UP",
    database: "DOWN",
    redis: "DOWN",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };

  try {
    const dbStatus = mongoose.connection.readyState;
    healthStatus.database = dbStatus === 1 ? "UP" : "DOWN";

    const redisStatus = await redisClient.ping();
    healthStatus.redis = redisStatus === "PONG" ? "UP" : "DOWN";

    const isHealthy =
      healthStatus.database === "UP" && healthStatus.redis === "UP";

    return res.status(isHealthy ? 200 : 503).json(healthStatus);
  } catch (error) {
    return res.status(503).json({
      ...healthStatus,
      error: error instanceof Error ? error.message : "Unknown Error",
    });
  }
});

export default router;
