import { body, param } from "express-validator";


export const createClassroomValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("isPublic")
    .optional()
    .isBoolean()
    .withMessage("isPublic must be a boolean"),

  body("joinCode")
    .optional()
    .isLength({ min: 4 })
    .withMessage("Join code must be at least 4 characters long"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array of strings"),

  body("tags.*")
    .optional()
    .isString()
    .withMessage("Each tag must be a string"),

  body("settings.maxStudents")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Max students must be at least 1"),

  body("settings.allowGuests")
    .optional()
    .isBoolean()
    .withMessage("allowGuests must be a boolean"),

  body("settings.chatEnabled")
    .optional()
    .isBoolean()
    .withMessage("chatEnabled must be a boolean"),

  body("settings.codeEditorEnabled")
    .optional()
    .isBoolean()
    .withMessage("codeEditorEnabled must be a boolean"),

  body("settings.canvasEnabled")
    .optional()
    .isBoolean()
    .withMessage("canvasEnabled must be a boolean"),
];

export const createClassScheduleValidator = [
  body("classroomId")
    .notEmpty()
    .withMessage("classroomId is required")
    .isMongoId()
    .withMessage("classroomId must be a valid Mongo ID"),

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("startTime")
    .notEmpty()
    .withMessage("startTime is required")
    .isISO8601()
    .withMessage("startTime must be a valid ISO8601 date"),

  body("endTime")
    .optional()
    .isISO8601()
    .withMessage("endTime must be a valid ISO8601 date"),

  body("recurrenceRule")
    .optional()
    .isString()
    .withMessage("recurrenceRule must be a string"),

  body("status")
    .optional()
    .isIn(["scheduled", "completed", "cancelled"])
    .withMessage("Status must be one of scheduled, completed, or cancelled")
];

export const updateClassroomValidator = [
  param("id").isMongoId().withMessage("Invalid classroom ID"),

  body("title").optional().isString(),
  body("description").optional().isString(),
  body("isPublic").optional().isBoolean(),
  body("status")
    .optional()
    .isIn(["active", "archived", "deleted"])
    .withMessage("Invalid status value"),
  body("tags").optional().isArray(),
];

export const joinClassroomValidator = [
  body("joinCode").notEmpty().withMessage("Join code is required"),
];

export const idParamValidator = [
  param("id").isMongoId().withMessage("Invalid classroom ID"),
];
