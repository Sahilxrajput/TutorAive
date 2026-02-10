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
    .toBoolean()
    .isBoolean()
    .withMessage("isPublic must be a boolean"),

  body("tags")
    .optional()
    .isString()
    .withMessage("Tags must be a string")
    .customSanitizer((value) =>
      value
        .split(" ")
        .map((tag: string) => tag.trim())
        .filter(Boolean),
    ),
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
    .withMessage("Status must be one of scheduled, completed, or cancelled"),
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

export const joinClassroomByCodeValidator = [
  param("code").notEmpty().withMessage("Join code is required"),
  param("classroomId").isMongoId().withMessage("Invalid Classroom ID"),
];

export const joinClassroomValidator = [
  param("classroomId")
    .isMongoId()
    .notEmpty()
    .withMessage("classroomId is required and must be valid mongoId"),
];

export const idParamValidator = [
  param("id").isMongoId().withMessage("Invalid mongo ID"),
];
export const classroomIdParamValidator = [
  param("classroomId").isMongoId().withMessage("Invalid mongo ID"),
];

export const saveAssignmentValidator = [
  // Validate the URL Parameter
  param("classroomId").isMongoId().withMessage("Invalid Classroom ID"),

  // Validate the Body
  body("title").trim().notEmpty().withMessage("Assignment title is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Assignment description is required"),

  body("pdfUrl").isURL().withMessage("A valid PDF URL is required"),

  body("public_id").notEmpty().withMessage("Public ID is required"),

  body("maxPoints")
    .notEmpty()
    .withMessage("Max points are required")
    .isInt({ min: 1 })
    .withMessage("Points must be a positive integer"),

  body("dueDate")
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
