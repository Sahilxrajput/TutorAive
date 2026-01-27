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
exports.startLecture = exports.attendenceAggregation = exports.attendenceLock = exports.exportAttendanceCSV = exports.exportAttendancePDF = exports.initializeAttendance = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const json2csv_1 = require("json2csv");
const attendence_model_1 = __importDefault(require("../models/attendence.model."));
const lecture_model_1 = __importDefault(require("../models/lecture.model"));
const mongoose_1 = require("mongoose");
const initializeAttendance = (classroomId, lectureId, students) => __awaiter(void 0, void 0, void 0, function* () {
    const ops = students.map((studentId) => ({
        updateOne: {
            filter: { classroom: classroomId, lectureId, student: studentId },
            update: {
                status: "absent",
                sessionDate: new Date(),
            },
            upsert: true,
        },
    }));
    yield attendence_model_1.default.bulkWrite(ops);
});
exports.initializeAttendance = initializeAttendance;
const exportAttendancePDF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield attendence_model_1.default.find({
        lectureId: req.params.lectureId,
    }).populate("student", "name");
    const doc = new pdfkit_1.default();
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);
    doc.fontSize(18).text("Attendance Report\n\n");
    data.forEach((a) => {
        doc.fontSize(12).text(`${a.student.name} - ${a.status.toUpperCase()}`);
    });
    doc.end();
});
exports.exportAttendancePDF = exportAttendancePDF;
const exportAttendanceCSV = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield attendence_model_1.default.find({
        lectureId: req.params.lectureId,
    }).populate("student", "name email");
    const parser = new json2csv_1.Parser({
        fields: ["student.name", "student.email", "status", "joinTime"],
    });
    const csv = parser.parse(data);
    res.header("Content-Type", "text/csv");
    res.attachment("attendance.csv");
    res.send(csv);
});
exports.exportAttendanceCSV = exportAttendanceCSV;
const attendenceLock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield lecture_model_1.default.findByIdAndUpdate(req.params.lectureId, {
        isAttendanceLocked: true,
    });
    res.json({ success: true });
});
exports.attendenceLock = attendenceLock;
const attendenceAggregation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { classroomId, studentId } = req.params;
    const data = yield attendence_model_1.default.aggregate([
        {
            $match: {
                classroom: new mongoose_1.Types.ObjectId(classroomId),
                student: new mongoose_1.Types.ObjectId(studentId),
            },
        },
        {
            $group: {
                _id: "$student",
                total: { $sum: 1 },
                present: {
                    $sum: {
                        $cond: [{ $ne: ["$status", "absent"] }, 1, 0],
                    },
                },
            },
        },
        {
            $project: {
                percentage: {
                    $multiply: [{ $divide: ["$present", "$total"] }, 100],
                },
            },
        },
    ]);
    res.json(data[0] || { percentage: 0 });
});
exports.attendenceAggregation = attendenceAggregation;
const startLecture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { classroomId, lectureId, students } = req.body;
    const records = students.map((studentId) => ({
        classroom: classroomId,
        lecture: lectureId,
        student: studentId,
        status: "absent",
        sessionDate: new Date(),
    }));
    yield attendence_model_1.default.insertMany(records);
    res.json({ success: true });
});
exports.startLecture = startLecture;
