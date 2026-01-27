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
    try {
        const classroomId = req.params.classroomId || req.body.classroomId;
        if (!classroomId) {
            console.log("Classroom ID is required");
            return res.status(400).json({ message: "Classroom ID is required" });
        }
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const classroom = yield classroom_model_1.Classroom.findById(classroomId).select("students createdBy");
        if (!classroom) {
            console.log("Classroom not found");
            return res.status(404).json({ message: "Classroom not found" });
        }
        // Allow the creator as well
        const isOwner = classroom.teacher.toString() === userId.toString();
        const isStudent = classroom.students.some((_id) => _id.toString() === userId.toString());
        console.log("isStudent", isStudent);
        console.log("isOwner", isOwner);
        if (!isOwner && !isStudent) {
            console.log("You are not enrolled/instructor in this classroom");
            return res
                .status(403)
                .json({ message: "You are not enrolled/instructor in this classroom" });
        }
        next();
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.isEnrolled = isEnrolled;
