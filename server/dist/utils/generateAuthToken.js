"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAuthToken = (user) => {
    // @ts-ignore
    return jsonwebtoken_1.default.sign({
        _id: user._id,
        email: user.email,
        profileImage: user.profilePicture,
    }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRY || "1d" });
};
exports.default = generateAuthToken;
