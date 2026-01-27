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
exports.gradeSubmission = exports.getStudentSubmission = exports.getSubmissionById = exports.getSubmissions = exports.saveSubmission = void 0;
const submission_model_1 = __importDefault(require("../models/submission.model"));
// Save assignment
const saveSubmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pdfUrl, public_id, resource_type } = req.body;
        const { assignmentId } = req.params;
        if (!resource_type || !pdfUrl || !public_id) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const submission = yield submission_model_1.default.create({
            student: req.userId,
            assignment: assignmentId,
            file: {
                url: pdfUrl,
                public_id,
                resource_type,
            },
            status: "submitted",
        });
        console.log("submission : ", submission);
        return res.status(201).json({
            success: true,
            message: "Submission done successfully",
            data: submission,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Server error uploading submission",
            error: err.message,
        });
    }
});
exports.saveSubmission = saveSubmission;
// Get submissions for a specific assignment (instructor)
const getSubmissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const submissions = yield submission_model_1.default.find({
            assignment: req.params.assignmentId,
        })
            .populate("student", "userName email")
            .sort({ submittedAt: -1 });
        res.json(submissions);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getSubmissions = getSubmissions;
// get submission by id
const getSubmissionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const submission = yield submission_model_1.default.findById(req.params.id)
            .populate("student", "userName email")
            .populate("assignment", "title dueDate");
        if (submission.student._id.toString() !== ((_a = req.userId) === null || _a === void 0 ? void 0 : _a.toString()) ||
            req.userRole !== "instructor") {
            return res
                .status(403)
                .json({ message: "You are not authorized to view this submission." });
        }
        res.status(200).json({ success: true, data: submission });
    }
    catch (err) {
        res
            .status(500)
            .json({ message: err.message || "Server error fetching submission" });
    }
});
exports.getSubmissionById = getSubmissionById;
// Get student's submission for a specific assignment
const getStudentSubmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const submission = yield submission_model_1.default.findOne({
            assignment: req.params.assignmentId,
            student: req.userId,
        });
        if (!submission)
            return res.status(404).json({ message: "No submission found" });
        res.json(submission);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getStudentSubmission = getStudentSubmission;
// Grade a submission (instructor)
const gradeSubmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { marks, feedback } = req.body;
        const submission = yield submission_model_1.default.findById(req.params.id).populate("assignmentId");
        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }
        const assignmentCreatorId = submission.assignmentId.createdBy.toString();
        if (assignmentCreatorId !== req.userId) {
            return res.status(403).json({
                message: "Unauthorized: Only the assignment creator can grade this.",
            });
        }
        submission.marks = marks;
        submission.feedback = feedback;
        submission.status = "graded";
        //@todo send a msg after grade the submission
        yield submission.save();
        return res.status(200).json({ message: "Graded successfully", submission });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }
});
exports.gradeSubmission = gradeSubmission;
