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
exports.getStudents = exports.archiveClassroom = exports.enrollClassroom = exports.deleteClassroom = exports.updateClassroom = exports.getClassroomById = exports.getClassrooms = exports.createClassroom = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const classroom_model_1 = require("../models/classroom.model");
const mongoose_1 = require("mongoose");
const cloudinary_1 = require("../lib/cloudinary");
// Create a new classroom
const createClassroom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, tags, description } = req.body;
        const classroomData = {
            title,
            tags,
            description,
            teacher: req.userId,
        };
        // Validate file type
        if (req.file &&
            !["image/png", "image/jpeg", "image/jpg"].includes(req.file.mimetype)) {
            return res.status(400).json({ error: "Invalid file type" });
        }
        // Upload file if exists
        let uploadResult = null;
        if (req.file) {
            uploadResult = yield new Promise((resolve, reject) => {
                var _a;
                const stream = cloudinary_1.cloudinary.uploader.upload_stream({ folder: "classroom Thumbnails" }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                stream.end((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.buffer);
            });
            classroomData.thumbnail = {
                url: uploadResult.secure_url,
                publicId: uploadResult.public_id,
            };
        }
        const classroom = yield classroom_model_1.Classroom.create(classroomData);
        res
            .status(201)
            .json({ classroom, message: "Classroom provisioned successfully!" });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "Failed to launch classroom", error });
    }
});
exports.createClassroom = createClassroom;
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
            .populate("teacher", "name email")
            .sort({ createdAt: -1 });
        res
            .status(200)
            .json({ message: "fetch classrooms successfully", data: classrooms });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "Failed to sync with TutorAive Database.", error });
    }
});
exports.getClassrooms = getClassrooms;
// Get a single classroom by ID
const getClassroomById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classroom = yield classroom_model_1.Classroom.findById(req.params.id)
            .populate("teacher", "name email userName profilePicture")
            .populate("students", "name email profilePicture");
        if (!classroom)
            return res.status(404).json({ message: "Classroom not found" });
        res.status(200).json(classroom);
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
const enrollClassroom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { classroomId } = req.params;
        const userId = new mongoose_1.Types.ObjectId(req.userId);
        const classroom = yield classroom_model_1.Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }
        const user = yield user_model_1.default.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        const isEnrolled = classroom.students.some((_id) => _id.toString() === userId.toString());
        // Enroll user if not already enrolled
        if (!isEnrolled) {
            classroom.students.push(userId);
            user.enrolledClassrooms.push(classroom._id);
            yield classroom.save();
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
const getStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // pagination values
        const page = Number(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;
        const classroom = req.authorizedResource;
        const totalStudents = classroom.students.length;
        // populate only required students
        yield classroom.populate({
            path: "students",
            options: { skip, limit },
        });
        res.json({
            totalStudents,
            page,
            limit,
            students: classroom.students,
            teacher: classroom.teacher,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getStudents = getStudents;
