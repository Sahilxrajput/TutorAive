import { body, param } from "express-validator";

export const createClassroomValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),

  body("description").optional().isString(),

  body("isPublic").optional().isBoolean(),

  body("joinCode")
    .optional()
    .isLength({ min: 4 })
    .withMessage("Join code must be at least 4 characters"),

  body("tags").optional().isArray().withMessage("Tags must be an array of strings"),

  body("settings.maxStudents")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Max students must be at least 1"),

  body("settings.allowGuests").optional().isBoolean(),
  body("settings.chatEnabled").optional().isBoolean(),
  body("settings.codeEditorEnabled").optional().isBoolean(),
  body("settings.canvasEnabled").optional().isBoolean(),
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
