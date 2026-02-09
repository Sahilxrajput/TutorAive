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
exports.authorizeOwner = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const lecture_model_1 = __importDefault(require("../../models/lecture.model"));
const assignment_model_1 = __importDefault(require("../../models/assignment.model"));
const classroom_model_1 = require("../../models/classroom.model");
const authorizeOwner = (_a) => __awaiter(void 0, [_a], void 0, function* ({ resourceType, resourceId, userId, }) {
    var _b, _c;
    if (!userId) {
        throw { status: 401, message: "Unauthorized" };
    }
    if (!resourceId) {
        throw { status: 400, message: "Resource ID is required" };
    }
    try {
        let classroomId = null;
        let resource = null;
        // ───────── LECTURE ─────────
        if (resourceType === "lecture") {
            resource = yield lecture_model_1.default.findById(resourceId).populate("classroom");
            if (!resource) {
                throw { status: 404, message: "Lecture not found" };
            }
            classroomId = (_b = resource.classroom) === null || _b === void 0 ? void 0 : _b._id;
        }
        // ───────── ASSIGNMENT ─────────
        else if (resourceType === "assignment") {
            resource = yield assignment_model_1.default.findById(resourceId).populate("classroom");
            if (!resource) {
                throw { status: 404, message: "Assignment not found" };
            }
            classroomId = (_c = resource.classroom) === null || _c === void 0 ? void 0 : _c._id;
        }
        // ───────── CLASSROOM ─────────
        else if (resourceType === "classroom") {
            resource = yield classroom_model_1.Classroom.findById(resourceId);
            if (!resource) {
                throw { status: 404, message: "Classroom not found" };
            }
            classroomId = resource._id;
        }
        if (!classroomId) {
            throw { status: 500, message: "Classroom reference missing" };
        }
        if (resource.teacher.toString() !== userId) {
            throw {
                status: 403,
                message: "You do not have permission to modify this resource",
            };
        }
        return resource;
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            throw { status: 400, message: "Invalid ID format" };
        }
        if (error === null || error === void 0 ? void 0 : error.status) {
            throw error;
        }
        throw { status: 500, message: "Internal server error" };
    }
});
exports.authorizeOwner = authorizeOwner;
