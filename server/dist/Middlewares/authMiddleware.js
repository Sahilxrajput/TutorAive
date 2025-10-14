"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Authentication middleware
function authMiddleware(req, res, next) {
    var _a, _b;
    // Get token from cookies or Authorization header
    const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) ||
        ((_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", ""));
    if (!token) {
        return res.status(401).json({ error: "No token found, please log in." });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.userId = decoded._id; // attach user ID to request
        console.log(decoded._id);
        next(); // user is authenticated, proceed
    }
    catch (err) {
        return res.status(403).json({ error: "Invalid or expired token." });
    }
}
