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
exports.getUserProfile = void 0;
exports.getUserClassrooms = getUserClassrooms;
const mongoose_1 = require("mongoose");
const classroom_model_1 = require("../models/classroom.model");
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
function getUserClassrooms(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = new mongoose_1.Types.ObjectId(req.userId);
            const classrooms = yield classroom_model_1.Classroom.find({
                $or: [{ teacher: userId }, { students: userId }],
            });
            res.status(200).json(classrooms);
        }
        catch (error) {
            console.error("Error fetching enrolled classrooms:", error);
            res.status(500).json({ message: "Server error" });
        }
    });
}
