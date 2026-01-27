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
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const ioredis_1 = __importDefault(require("ioredis"));
const router = (0, express_1.Router)();
const redis = new ioredis_1.default(process.env.REDIS_URL);
router.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const mongoState = mongoose_1.default.connection.readyState === 1;
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
}));
exports.default = router;
