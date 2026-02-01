"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (user) => {
    const { _id, role, userName } = user;
    // @ts-ignore
    return jsonwebtoken_1.default.sign({ _id, role, userName }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m",
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user) => {
    const { _id } = user;
    // @ts-ignore
    return jsonwebtoken_1.default.sign({ _id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d",
    });
};
exports.generateRefreshToken = generateRefreshToken;
