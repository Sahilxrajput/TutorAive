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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEnrolled = void 0;
const classroom_model_1 = require("../models/classroom.model");
const isEnrolled = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const classroomId = req.params.classroomId || req.body.classroomId;
        if (!classroomId) {
            return res.status(400).json({ message: "Classroom ID is required" });
        }
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const classroom = yield classroom_model_1.Classroom.findById(classroomId).select("students teacher");
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }
        const isEnrolled = classroom.students.some((_id) => _id.toString() === userId.toString());
        // Allow the creator as well
        const isClassroomInstructor = ((_a = classroom.teacher) === null || _a === void 0 ? void 0 : _a.toString()) === userId.toString();
        if (!isEnrolled && !isClassroomInstructor)
            return res.status(403).json({
                message: "Access denied. Only enrolled students or instructors can access this classroom.",
            });
        req.authorizedResource = classroom;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.isEnrolled = isEnrolled;
