"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env.local") });
exports.ENV = {
    FRONTEND_URL: process.env.FRONTEND_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    TOKEN_EXPIRY: process.env.TOKEN_EXPIRY || "1d",
    COOKIE_KEY: process.env.COOKIE_KEY,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URI: process.env.MONGODB_URI,
    GOOGLE_CLIET_ID: process.env.GOOGLE_CLIET_ID,
    GOOGLE_CLIET_SECRET: process.env.GOOGLE_CLIET_SECRET,
};
