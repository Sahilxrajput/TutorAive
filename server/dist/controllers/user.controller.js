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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myProfile = exports.getUserProfile = void 0;
exports.getAllEnrolledClassrooms = getAllEnrolledClassrooms;
const user_model_1 = __importDefault(require("../models/user.model"));
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield user_model_1.default.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error." });
    }
});
exports.getUserProfile = getUserProfile;
const myProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(req.userId).select("+password"); // convert to plain JS object
        if (!user)
            return res.status(404).json({ error: "User not found" });
        // exclude password
        const _a = user.toObject(), { password } = _a, userData = __rest(_a, ["password"]);
        res.status(200).json(userData);
    }
    catch (err) {
        res.status(500).json({ error: "Server error", message: err.message });
    }
});
exports.myProfile = myProfile;
function getAllEnrolledClassrooms(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.default.findById(req.userId).populate("enrolledClassrooms");
            if (!user)
                return res.status(404).json({ message: "User not found" });
            res.status(200).json(user.enrolledClassrooms);
        }
        catch (error) {
            console.error("Error fetching enrolled classrooms:", error);
            res.status(500).json({ message: "Server error" });
        }
    });
}
