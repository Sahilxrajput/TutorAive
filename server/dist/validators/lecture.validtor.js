"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLectureValidator = exports.createLectureValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createLectureValidator = [
    (0, express_validator_1.body)("title").trim().notEmpty().withMessage("Title is required"),
    (0, express_validator_1.body)("classroomId")
        .notEmpty()
        .withMessage("Classroom ID is required")
        .isMongoId()
        .withMessage("Invalid classroom ID"),
    (0, express_validator_1.body)("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(["scheduled", "live"])
        .withMessage("Status must be either of scheduled or live"),
    (0, express_validator_1.body)("startTime")
        .notEmpty()
        .withMessage("Start time is required")
        .isISO8601()
        .withMessage("Start time must be a valid ISO 8601 date")
        .toDate(),
];
exports.updateLectureValidator = [
    /* ---------------- PARAM ---------------- */
    (0, express_validator_1.param)("id").isMongoId().withMessage("Invalid lecture ID"),
    //   param("classroomId").isMongoId().withMessage("Invalid classroom ID"),
    /* ---------------- BASIC FIELDS ---------------- */
    (0, express_validator_1.body)("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty"),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn([
        "scheduled",
        "rescheduled",
        "delayed",
        "live",
        "completed",
        "cancelled",
    ])
        .withMessage("Invalid lecture status"),
    (0, express_validator_1.body)("newStartTime")
        .optional()
        .isISO8601()
        .withMessage("newStartTime must be a valid ISO date")
        .toDate(),
    (0, express_validator_1.body)("delayTime")
        .optional()
        .isInt({ min: 1, max: 120 })
        .withMessage("delayTime must be between 1 and 120 minutes"),
    (0, express_validator_1.body)("reason")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Reason cannot be empty"),
    /* ---------------- CONDITIONAL RULES ---------------- */
    // delayed → delayTime + reason required
    (0, express_validator_1.body)("delayTime")
        .if((0, express_validator_1.body)("status").equals("delayed"))
        .exists()
        .withMessage("delayTime is required when lecture is delayed")
        .bail()
        .isFloat({ gt: 0 })
        .withMessage("delayTime must be a positive number"),
    (0, express_validator_1.body)("reason")
        .if((0, express_validator_1.body)("status").equals("delayed"))
        .exists()
        .withMessage("Delay reason is required"),
    // cancelled → reason required
    (0, express_validator_1.body)("reason")
        .if((0, express_validator_1.body)("status").equals("cancelled"))
        .exists()
        .withMessage("Cancel reason is required"),
    // scheduled / rescheduled → newStartTime required
    (0, express_validator_1.body)("newStartTime")
        .if((0, express_validator_1.body)("status").isIn(["scheduled", "rescheduled"]))
        .exists()
        .withMessage("newStartTime is required for scheduled or rescheduled lectures"),
    /* ---------------- FORBIDDEN COMBINATIONS ---------------- */
    (0, express_validator_1.body)().custom((body) => {
        const { status, newStartTime, delayTime } = body;
        // delayed must NOT accept absolute time
        if (status === "delayed" && newStartTime) {
            throw new Error("newStartTime is not allowed when lecture is delayed");
        }
        // reschedule / schedule must NOT accept delayTime
        if ((status === "scheduled" || status === "rescheduled") && delayTime) {
            throw new Error("delayTime is not allowed for scheduled or rescheduled lectures");
        }
        // reason without status is meaningless
        if (body.reason && !status) {
            throw new Error("reason cannot be provided without status");
        }
        return true;
    }),
    /* ---------------- AT LEAST ONE FIELD ---------------- */
    (0, express_validator_1.body)().custom((body) => {
        if (!body.status &&
            !body.title &&
            !body.newStartTime &&
            !body.delayTime &&
            !body.reason) {
            throw new Error("At least one field must be provided for update");
        }
        return true;
    }),
];
