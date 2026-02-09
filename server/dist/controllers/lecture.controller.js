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
exports.attendanceLock = exports.getAllScheduleLecturesForClassroom = exports.getClassroomLectures = exports.getAllLecturesForStudent = exports.getAllLecturesForInstructor = exports.getAllScheduleLecturesForStudent = exports.getAllScheduleLecturesForInstructor = exports.deleteLecture = exports.updateLecture = exports.createLecture = void 0;
const classroom_model_1 = require("../models/classroom.model");
const lecture_model_1 = __importDefault(require("../models/lecture.model"));
const queue_1 = require("../redis/queue");
const mongoose_1 = require("mongoose");
const handleError = (res, error, defaultMessage = "Internal Server Error", statusCode = 500) => {
    console.error(error); // Log the detailed error for debugging
    return res.status(statusCode).json({
        success: false,
        error: (error === null || error === void 0 ? void 0 : error.message) || defaultMessage,
        message: defaultMessage,
    });
};
const ALLOWED_TRANSITIONS = {
    scheduled: ["rescheduled", "live", "delayed", "cancelled"],
    rescheduled: ["rescheduled", "live", "delayed", "cancelled"],
    //   starting_soon: ["live", "delayed", "cancelled"],
    delayed: ["rescheduled", "live", "cancelled"],
    live: ["completed"],
    completed: [],
    cancelled: [],
};
const createLecture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, status, startTime, classroomId } = req.body;
        if (!title || !classroomId || !startTime || !status) {
            return res
                .status(400)
                .json({ success: false, message: "Missing required fields." });
        }
        const classroom = req.authorizedResource;
        if (!classroom) {
            return res
                .status(500)
                .json({ success: false, message: "Authorized classroom missing" });
        }
        const newLecture = yield lecture_model_1.default.create({
            title,
            status,
            startTime,
            classroom: classroom._id,
            createdBy: req.userId, // @check
        });
        yield newLecture.populate("classroom");
        (0, queue_1.addClassNotificationJob)(newLecture);
        return res.status(201).json({
            success: true,
            message: status === "live" ? "Lecture is live!" : "Lecture scheduled.",
            data: newLecture,
        });
    }
    catch (error) {
        handleError(res, error);
    }
});
exports.createLecture = createLecture;
const updateLecture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, title, newStartTime, delayTime, reason } = req.body;
        const lecture = req.authorizedResource;
        if (!lecture) {
            return res.status(500).json({
                success: false,
                message: "Authorized lecture missing",
            });
        }
        if (title)
            lecture.title = title;
        let notificationTime;
        if (status) {
            const allowedNext = ALLOWED_TRANSITIONS[lecture.status] || [];
            if (!allowedNext.includes(status)) {
                return res
                    .status(400)
                    .json({ message: `Invalid transition to ${status}` });
            }
            if (status === "delayed" && delayTime) {
                lecture.startTime = new Date(lecture.startTime.getTime() + delayTime * 60000);
                lecture.delayReason = reason;
                notificationTime = lecture.startTime;
            }
            if (status === "cancelled") {
                lecture.cancelReason = reason;
            }
            if (status === "rescheduled" && newStartTime) {
                lecture.startTime = new Date(newStartTime);
                // lecture.rescheduleReason = reason;
                notificationTime = lecture.startTime;
            }
            lecture.status = status;
        }
        yield lecture.save();
        if (status)
            (0, queue_1.addClassNotificationJob)(lecture);
        res.json({
            success: true,
            message: `Lecture updated`,
            lecture,
        });
    }
    catch (error) {
        handleError(res, error);
    }
});
exports.updateLecture = updateLecture;
const deleteLecture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lecture = req.authorizedResource;
        if (!lecture) {
            return res.status(500).json({
                success: false,
                message: "Authorized lecture missing",
            });
        }
        yield lecture_model_1.default.findByIdAndDelete(lecture._id);
        return res.status(200).json({
            success: true,
            message: "Lecture deleted.",
        });
    }
    catch (error) {
        handleError(res, error);
    }
});
exports.deleteLecture = deleteLecture;
const getAllScheduleLecturesForInstructor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const scheduledLectures = yield lecture_model_1.default.find({
            createdBy: req.userId,
            status: { $in: ["scheduled", "rescheduled", "delayed"] },
        }).sort({ startTime: 1 });
        return res.status(200).json({
            success: true,
            message: "Successfully fetched scheduled lectures created by instructor.",
            data: scheduledLectures,
        });
    }
    catch (error) {
        handleError(res, error, "Failed to fetch scheduled lectures for instructor.");
    }
});
exports.getAllScheduleLecturesForInstructor = getAllScheduleLecturesForInstructor;
const getAllScheduleLecturesForStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const scheduledLectures = yield lecture_model_1.default.find({
            status: { $in: ["scheduled", "rescheduled", "delayed"] },
        })
            .populate({
            path: "classroom",
            match: { students: req.userId },
            select: "title",
        })
            .sort({ startTime: 1 })
            .exec()
            .then((lectures) => lectures.filter((l) => l.classroom));
        return res.status(200).json({
            success: true,
            message: "Successfully fetched scheduled lectures for student.",
            data: scheduledLectures,
        });
    }
    catch (error) {
        handleError(res, error, "Failed to fetch scheduled lectures for student.");
    }
});
exports.getAllScheduleLecturesForStudent = getAllScheduleLecturesForStudent;
const getAllLecturesForInstructor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lectures = yield lecture_model_1.default.find({ createdBy: req.userId }).sort({
            startTime: 1,
        }); // Sort by time
        // Return empty array with 200 status if none found (better than 404 for a list route)
        return res.status(200).json({
            success: true,
            message: "Successfully fetched all created lectures.",
            data: lectures,
        });
    }
    catch (error) {
        handleError(res, error, "Failed to fetch created lectures.");
    }
});
exports.getAllLecturesForInstructor = getAllLecturesForInstructor;
const getAllLecturesForStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const myLectures = yield lecture_model_1.default.find({})
            .populate({
            path: "classroom",
            match: { students: req.userId },
            select: "title students", // Only fetch necessary fields from classroom
        })
            .sort({ startTime: 1 })
            .exec()
            .then((lectures) => lectures.filter((l) => l.classroom));
        return res.status(200).json({
            success: true,
            message: "Successfully fetched enrolled lectures.",
            data: myLectures,
        });
    }
    catch (error) {
        handleError(res, error, "Failed to fetch enrolled lectures.");
    }
});
exports.getAllLecturesForStudent = getAllLecturesForStudent;
const getClassroomLectures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { classroomId } = req.params;
        const classroom = yield classroom_model_1.Classroom.findById(classroomId);
        if (!classroom) {
            throw new Error("You are not enrolled in this classroom");
        }
        const isEnrolled = classroom.students.includes(new mongoose_1.Types.ObjectId(req.userId));
        if (!isEnrolled)
            return res.status(403).json({ message: "User is not enrolled" });
        const myLectures = yield lecture_model_1.default.find({
            classroom: classroomId,
        })
            .populate("createdBy", "userName firstName")
            .sort({ startTime: 1 });
        return res.status(200).json({
            success: true,
            message: `Successfully fetched your lectures for classroom ${classroom.title}.`,
            data: myLectures !== null && myLectures !== void 0 ? myLectures : [],
        });
    }
    catch (error) {
        handleError(res, error, "Failed to fetch classroom lectures for student.");
    }
});
exports.getClassroomLectures = getClassroomLectures;
const getAllScheduleLecturesForClassroom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classroomId = req.params.classroomId;
        // 1. Validate Classroom
        const classroom = yield classroom_model_1.Classroom.findById(classroomId);
        if (!classroom) {
            return res
                .status(404)
                .json({ success: false, message: "Classroom not found." });
        }
        // 2. Authorization Check //@todo a middleware
        const isInstructor = classroom.teacher.toString() === req.userId;
        const isStudent = classroom.students.some((studentId) => studentId.toString() === req.userId);
        if (!isInstructor && !isStudent) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: You are neither the instructor nor an enrolled student in this classroom.",
            });
        }
        // 3. Fetch scheduled lectures
        const scheduledLectures = yield lecture_model_1.default.find({
            classroom: classroomId,
            status: "scheduled",
        }).sort({ startTime: 1 });
        return res.status(200).json({
            success: true,
            message: "Successfully fetched scheduled lectures for classroom.",
            data: scheduledLectures,
        });
    }
    catch (error) {
        handleError(res, error, "Failed to fetch scheduled classroom lectures.");
    }
});
exports.getAllScheduleLecturesForClassroom = getAllScheduleLecturesForClassroom;
const attendanceLock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lecture = req.authorizedResource;
        if (!lecture) {
            return res.status(500).json({
                success: false,
                message: "Authorized lecture missing",
            });
        }
        lecture.isAttendanceLocked = true;
        yield lecture.save();
        return res.json({ success: true });
    }
    catch (error) {
        handleError(res, error);
    }
});
exports.attendanceLock = attendanceLock;
