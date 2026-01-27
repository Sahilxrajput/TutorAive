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
exports.updateAssignment = exports.deleteAssignment = exports.getAssignmentsByClassroomId = exports.getAssignmentById = exports.getMyAssignmentProgress = exports.getStudentAssignmentProgress = exports.getAssignmentsForInstructor = exports.getAssignmentsOfStudent = exports.saveAssignment = exports.cloudinarySignature = void 0;
const assignment_model_1 = __importDefault(require("../models/assignment.model"));
const classroom_model_1 = require("../models/classroom.model");
const submission_model_1 = __importDefault(require("../models/submission.model"));
const cloudinary_1 = require("../lib/cloudinary");
const queue_1 = require("../redis/queue");
const cloudinarySignature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { CLOUD_API_KEY, CLOUD_NAME, CLOUD_API_SECRET } = process.env;
        const classroom = req.authorizedResource;
        if (!classroom)
            return;
        const timestamp = Math.floor(Date.now() / 1000);
        // const folder = "tweets";
        const folder = "assignment files";
        const signature = cloudinary_1.cloudinary.utils.api_sign_request({
            timestamp,
            folder,
        }, CLOUD_API_SECRET);
        return res.json({
            timestamp,
            signature,
            cloudName: CLOUD_NAME,
            apiKey: CLOUD_API_KEY,
            folder,
        });
    }
    catch (_a) {
        return res.status(500).json({
            success: false,
            message: "Failed to generate Cloudinary signature",
        });
    }
});
exports.cloudinarySignature = cloudinarySignature;
const saveAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pdfUrl, public_id, title, description, dueDate, resource_type, maxPoints, } = req.body;
        const { classroomId } = req.params;
        // 1. Authorization Check
        const classroomDoc = req.authorizedResource;
        if (!classroomDoc)
            return;
        // 2. Create Assignment
        const assignment = yield assignment_model_1.default.create({
            classroom: classroomId,
            title,
            description,
            dueDate: new Date(dueDate),
            createdBy: req.userId,
            maxPoints: Number(maxPoints) || 0,
            file: {
                url: pdfUrl,
                public_id,
                resource_type,
            },
        });
        // Message Queue (Email/Push Notifications)
        yield (0, queue_1.addAssignmentNotificationJob)({
            classroomId: classroomDoc._id.toString(),
            classroomTitle: classroomDoc.title,
            assignmentId: assignment._id.toString(),
            title: assignment.title,
            dueDate,
        });
        return res.status(201).json({
            success: true,
            message: "Assignment created successfully",
            data: assignment,
        });
    }
    catch (_a) {
        return res.status(500).json({
            success: false,
            message: "Failed to create assignment",
        });
    }
});
exports.saveAssignment = saveAssignment;
const getAssignmentsOfStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { studentId } = req.params;
        //@todo move it to a middleware
        if (studentId !== userId && req.userRole !== "instructor") {
            return res.status(403).json({
                success: false,
                message: "you are not authorized to check it",
            });
        }
        // Find classrooms where the user is a member
        const classrooms = yield classroom_model_1.Classroom.find({ students: userId }).select("_id");
        if (!classrooms.length)
            return res
                .status(404)
                .json({ message: "User is not enrolled in any classroom." });
        const classroomIds = classrooms.map((c) => c._id);
        // 2. Fetch assignments for all those classrooms
        const assignments = yield assignment_model_1.default.find({
            classroom: { $in: classroomIds },
        });
        // 3. Get all submissions by this student for these classroom
        const submissions = yield submission_model_1.default.find({ student: studentId });
        // Convert submitted assignment IDs into a Set for fast lookup
        const submittedIds = new Set(submissions.map((s) => s.assignment.toString()));
        // 3. Split into pending + submitted
        const submitted = assignments.filter((a) => submittedIds.has(a._id.toString()));
        const pending = assignments.filter((a) => !submittedIds.has(a._id.toString()));
        res.status(200).json({
            success: true,
            submitted,
            pending,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching assignments.",
        });
    }
});
exports.getAssignmentsOfStudent = getAssignmentsOfStudent;
const getAssignmentsForInstructor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assignments = yield assignment_model_1.default.find({
            createdBy: req.userId,
        })
            .populate("classroom", "title")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Fetched teacher assignments",
            data: assignments,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.getAssignmentsForInstructor = getAssignmentsForInstructor;
const getStudentAssignmentProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { classroomId, studentId } = req.params;
        // 1. Get all assignments for the classroom
        const assignments = yield assignment_model_1.default.find({ classroom: classroomId });
        // 2. Get all submissions by this student for this classroom
        const submissions = yield submission_model_1.default.find({ student: studentId });
        // Convert submitted assignment IDs into a Set for fast lookup
        const submittedIds = new Set(submissions.map((s) => s.assignment.toString()));
        // 3. Split into pending + submitted
        const submitted = assignments.filter((a) => submittedIds.has(a._id.toString()));
        const pending = assignments.filter((a) => !submittedIds.has(a._id.toString()));
        res.status(200).json({
            success: true,
            submitted,
            pending,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err === null || err === void 0 ? void 0 : err.message });
    }
});
exports.getStudentAssignmentProgress = getStudentAssignmentProgress;
const getMyAssignmentProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { classroomId } = req.params;
        // 1. Get all assignments for the classroom
        const assignments = yield assignment_model_1.default.find({ classroom: classroomId });
        // 2. Get all submissions by this student for this classroom
        const submissions = yield submission_model_1.default.find({ student: req.userId });
        // Convert submitted assignment IDs into a Set for fast lookup
        const submittedIds = new Set(submissions.map((s) => s.assignment.toString()));
        // 3. Split into pending + submitted
        const submitted = assignments.filter((a) => submittedIds.has(a._id.toString()));
        const pending = assignments.filter((a) => !submittedIds.has(a._id.toString()));
        res.status(200).json({
            success: true,
            submitted,
            pending,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err === null || err === void 0 ? void 0 : err.message });
    }
});
exports.getMyAssignmentProgress = getMyAssignmentProgress;
// Get single assignment
const getAssignmentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assignment = yield assignment_model_1.default.findById(req.params.id);
        if (!assignment)
            return res.status(404).json({ message: "Assignment not found" });
        res.json({ success: true, data: assignment });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.getAssignmentById = getAssignmentById;
//get all assignment of a classroom
const getAssignmentsByClassroomId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classroom = req.authorizedResource;
        if (!classroom)
            return;
        const assignments = yield assignment_model_1.default.find({
            classroom: req.params.classroomId,
        });
        if (!assignments)
            return res.status(404).json({ message: "Assignment not found" });
        res.status(200).json({ data: assignments, success: true });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getAssignmentsByClassroomId = getAssignmentsByClassroomId;
// Delete assignment (instructor only)
const deleteAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const assignment = req.authorizedResource;
        if (!assignment)
            return;
        // Delete Cloudinary image if exists
        if ((_a = assignment === null || assignment === void 0 ? void 0 : assignment.file) === null || _a === void 0 ? void 0 : _a.public_id) {
            yield cloudinary_1.cloudinary.uploader.destroy(assignment.file.public_id);
        }
        yield assignment_model_1.default.findByIdAndDelete(req.params.id);
        res
            .status(200)
            .json({ success: true, message: "Assignment deleted successfully" });
        if (!assignment)
            return res.status(404).json({ message: "Assignment not found" });
        yield assignment.deleteOne();
        res.json({ message: "Assignment deleted" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.deleteAssignment = deleteAssignment;
//@todo
const updateAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assignment = yield assignment_model_1.default.findById(req.params.id);
        if (assignment.createdBy.toString() !== req.userId) {
            return res
                .status(403)
                .json({ error: "Not authorized to update this assignmnet" });
        }
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }
        const updated = yield assignment_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: updated });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
});
exports.updateAssignment = updateAssignment;
// export const getAllAssignmentsInClassroom = async (req: Request, res: Response) => {
//   try {
//     const { classroomId } = req.params;
//     const studentId = req.userId;
//     if (!mongoose.Types.ObjectId.isValid(classroomId)) {
//       return res.status(400).json({ message: "Invalid classroom id" });
//     }
//     const assignments = await Assignment.aggregate([
//       // 1. Match classroom
//       {
//         $match: {
//           classroom: new mongoose.Types.ObjectId(classroomId),
//         },
//       },
//       // 2. Lookup student's submission
//       {
//         $lookup: {
//           from: "submissions",
//           let: { assignmentId: "$_id" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     { $eq: ["$assignment", "$$assignmentId"] },
//                     {
//                       $eq: ["$student", new mongoose.Types.ObjectId(studentId)],
//                     },
//                   ],
//                 },
//               },
//             },
//           ],
//           as: "mySubmission",
//         },
//       },
//       // 3. Add submission flags
//       {
//         $addFields: {
//           isSubmitted: { $gt: [{ $size: "$mySubmission" }, 0] },
//           submissionId: { $arrayElemAt: ["$mySubmission._id", 0] },
//           submittedAt: { $arrayElemAt: ["$mySubmission.createdAt", 0] },
//         },
//       },
//       // 4. Cleanup
//       {
//         $project: {
//           mySubmission: 0,
//         },
//       },
//       // 5. Sort by due date (optional but useful)
//       {
//         $sort: { dueDate: 1 },
//       },
//     ]);
//     // 6. Split result
//     const submitted = [];
//     const pending = [];
//     for (const a of assignments) {
//       a.isSubmitted ? submitted.push(a) : pending.push(a);
//     }
//     return res.status(200).json({
//       success: true,
//       data: {
//         submitted,
//         pending,
//       },
//     });
//   } catch (error) {
//     console.error("Assignment status fetch error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch assignments",
//     });
//   }
// };
