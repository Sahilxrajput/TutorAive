"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveAssignmentValidator = exports.classroomIdParamValidator = exports.idParamValidator = exports.joinClassroomValidator = exports.joinClassroomByCodeValidator = exports.updateClassroomValidator = exports.createClassScheduleValidator = exports.createClassroomValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createClassroomValidator = [
    (0, express_validator_1.body)("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 3 })
        .withMessage("Title must be at least 3 characters long"),
    (0, express_validator_1.body)("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),
    (0, express_validator_1.body)("isPublic")
        .optional()
        .toBoolean()
        .isBoolean()
        .withMessage("isPublic must be a boolean"),
    (0, express_validator_1.body)("tags")
        .optional()
        .isString()
        .withMessage("Tags must be a string")
        .customSanitizer((value) => value
        .split(" ")
        .map((tag) => tag.trim())
        .filter(Boolean)),
];
exports.createClassScheduleValidator = [
    (0, express_validator_1.body)("classroomId")
        .notEmpty()
        .withMessage("classroomId is required")
        .isMongoId()
        .withMessage("classroomId must be a valid Mongo ID"),
    (0, express_validator_1.body)("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 3 })
        .withMessage("Title must be at least 3 characters long"),
    (0, express_validator_1.body)("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),
    (0, express_validator_1.body)("startTime")
        .notEmpty()
        .withMessage("startTime is required")
        .isISO8601()
        .withMessage("startTime must be a valid ISO8601 date"),
    (0, express_validator_1.body)("endTime")
        .optional()
        .isISO8601()
        .withMessage("endTime must be a valid ISO8601 date"),
    (0, express_validator_1.body)("recurrenceRule")
        .optional()
        .isString()
        .withMessage("recurrenceRule must be a string"),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["scheduled", "completed", "cancelled"])
        .withMessage("Status must be one of scheduled, completed, or cancelled"),
];
exports.updateClassroomValidator = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Invalid classroom ID"),
    (0, express_validator_1.body)("title").optional().isString(),
    (0, express_validator_1.body)("description").optional().isString(),
    (0, express_validator_1.body)("isPublic").optional().isBoolean(),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["active", "archived", "deleted"])
        .withMessage("Invalid status value"),
    (0, express_validator_1.body)("tags").optional().isArray(),
];
exports.joinClassroomByCodeValidator = [
    (0, express_validator_1.param)("code").notEmpty().withMessage("Join code is required"),
    (0, express_validator_1.param)("classroomId").isMongoId().withMessage("Invalid Classroom ID"),
];
exports.joinClassroomValidator = [
    (0, express_validator_1.param)("classroomId")
        .isMongoId()
        .notEmpty()
        .withMessage("classroomId is required and must be valid mongoId"),
];
exports.idParamValidator = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Invalid mongo ID"),
];
exports.classroomIdParamValidator = [
    (0, express_validator_1.param)("classroomId").isMongoId().withMessage("Invalid mongo ID"),
];
exports.saveAssignmentValidator = [
    // Validate the URL Parameter
    (0, express_validator_1.param)("classroomId").isMongoId().withMessage("Invalid Classroom ID"),
    // Validate the Body
    (0, express_validator_1.body)("title").trim().notEmpty().withMessage("Assignment title is required"),
    (0, express_validator_1.body)("description")
        .trim()
        .notEmpty()
        .withMessage("Assignment description is required"),
    (0, express_validator_1.body)("pdfUrl").isURL().withMessage("A valid PDF URL is required"),
    (0, express_validator_1.body)("public_id").notEmpty().withMessage("Public ID is required"),
    (0, express_validator_1.body)("maxPoints")
        .notEmpty()
        .withMessage("Max points are required")
        .isInt({ min: 0 })
        .withMessage("Points must be a positive integer"),
    (0, express_validator_1.body)("dueDate")
        .notEmpty()
        .withMessage("Due date is required")
        .isISO8601()
        .withMessage("Due date must be a valid ISO 8601 date")
        .toDate()
        .custom((value) => {
        if (value < new Date()) {
            throw new Error("Due date cannot be in the past");
        }
        return true;
    }),
];
