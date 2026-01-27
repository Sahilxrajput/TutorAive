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
exports.archiveClassroom = exports.enrollClassroom = exports.enrollClassroomByCode = exports.deleteClassroom = exports.updateClassroom = exports.getClassroomById = exports.getClassrooms = exports.createClassroom = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const classroom_model_1 = require("../models/classroom.model");
const mongoose_1 = require("mongoose");
// Create a new classroom
const createClassroom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classroom = yield classroom_model_1.Classroom.create(Object.assign(Object.assign({}, req.body), { teacher: req.userId }));
        res.status(201).json(classroom);
    }
    catch (error) {
        res.status(400).json({ message: "Failed to create classroom", error });
    }
});
exports.createClassroom = createClassroom;
// @todo
// Get all classrooms (with optional filtering)
const getClassrooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, isPublic } = req.query;
        const filter = {};
        if (status)
            filter.status = status;
        if (isPublic !== undefined)
            filter.isPublic = isPublic === "true";
        const classrooms = yield classroom_model_1.Classroom.find(filter)
            //? @fix think about populated fields
            .populate("teacher", "name email")
            .sort({ createdAt: -1 });
        res
            .status(200)
            .json({ message: "fetch classrooms successfully", data: classrooms });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching classrooms", error });
    }
});
exports.getClassrooms = getClassrooms;
// get all enrolled classrooms
// export const getAllEnrolledClassrooms = async (req: Request, res: Response) => {
//   const classrooms = await Classroom.find({
//     students: req.userId,
//   });
//   if (!classrooms)
//     return res.status(404).json({
//       message: "classrooms not found",
//     });
//   console.log("classrooms -> ", classrooms);
//   return res.status(200).json({
//     message: "fetch all enrolled classrooms",
//     data: classrooms,
//   });
// };
// Get a single classroom by ID
const getClassroomById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classroom = yield classroom_model_1.Classroom.findById(req.params.id)
            .populate("teacher", "name email profilePicture")
            .populate("students", "name email profilePicture");
        //@remind
        if (!classroom)
            return res.status(404).json({ message: "Classroom not found" });
        res.json(classroom);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching classroom", error });
    }
});
exports.getClassroomById = getClassroomById;
// Update classroom details
const updateClassroom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updated = yield classroom_model_1.Classroom.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updated)
            return res.status(404).json({ message: "Classroom not found" });
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ message: "Failed to update classroom", error });
    }
});
exports.updateClassroom = updateClassroom;
//@todo permanent delete
// Delete (soft-delete or permanently remove)
const deleteClassroom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classroom = yield classroom_model_1.Classroom.findByIdAndUpdate(req.params.id, { status: "deleted" }, { new: true });
        if (!classroom)
            return res.status(404).json({ message: "Classroom not found" });
        res.json({ message: "Classroom deleted", classroom });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting classroom", error });
    }
});
exports.deleteClassroom = deleteClassroom;
// Join a classroom using joinCode
const enrollClassroomByCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { joinCode } = req.body;
        const classroom = yield classroom_model_1.Classroom.findOne({ joinCode });
        if (!classroom)
            return res.status(404).json({ message: "Invalid join code" });
        const userID = new mongoose_1.Types.ObjectId(req.userId);
        if (!classroom.students.includes(userID)) {
            classroom.students.push(userID);
            yield classroom.save();
        }
        res.json({ message: "Joined classroom successfully", classroom });
    }
    catch (error) {
        res.status(500).json({ message: "Error joining classroom", error });
    }
});
exports.enrollClassroomByCode = enrollClassroomByCode;
const enrollClassroom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { classroomId } = req.body;
        const userId = new mongoose_1.Types.ObjectId(req.userId); // ensure this is populated by auth middleware
        const classroom = yield classroom_model_1.Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }
        const user = yield user_model_1.default.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Enroll user if not already enrolled
        if (!classroom.students.includes(userId)) {
            console.log("classroom update");
            classroom.students.push(userId);
            yield classroom.save();
        }
        // Update user's enrolledCourses
        if (!user.enrolledClassrooms.includes(classroomId)) {
            console.log("user update");
            user.enrolledClassrooms.push(classroomId);
            yield user.save();
        }
        res.status(200).json({
            success: true,
            message: "Enrolled in classroom successfully",
            classroom,
        });
    }
    catch (error) {
        console.error("Error enrolling classroom:", error);
        res.status(500).json({
            success: false,
            message: "Error enrolling in classroom",
            error: error.message,
        });
    }
});
exports.enrollClassroom = enrollClassroom;
// Archive a classroom
const archiveClassroom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classroom = yield classroom_model_1.Classroom.findByIdAndUpdate(req.params.id, { status: "archived" }, { new: true });
        if (!classroom)
            return res.status(404).json({ message: "Classroom not found" });
        res.json({ message: "Classroom archived", classroom });
    }
    catch (error) {
        res.status(500).json({ message: "Error archiving classroom", error });
    }
});
exports.archiveClassroom = archiveClassroom;
