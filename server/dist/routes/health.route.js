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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const ioredis_1 = __importDefault(require("ioredis"));
const redisClient = new ioredis_1.default((_a = process.env.REDIS_URL) !== null && _a !== void 0 ? _a : "redis://localhost:6379");
const router = (0, express_1.Router)();
router.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const healthStatus = {
        server: "UP",
        database: "DOWN",
        redis: "DOWN",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    };
    try {
        const dbStatus = mongoose_1.default.connection.readyState;
        healthStatus.database = dbStatus === 1 ? "UP" : "DOWN";
        const redisStatus = yield redisClient.ping();
        healthStatus.redis = redisStatus === "PONG" ? "UP" : "DOWN";
        const isHealthy = healthStatus.database === "UP" && healthStatus.redis === "UP";
        return res.status(isHealthy ? 200 : 503).json(healthStatus);
    }
    catch (error) {
        return res.status(503).json(Object.assign(Object.assign({}, healthStatus), { error: error instanceof Error ? error.message : "Unknown Error" }));
    }
}));
exports.default = router;
