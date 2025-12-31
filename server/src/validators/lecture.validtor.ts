import { body, param } from "express-validator";

export const createLectureValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),

  body("classroomId")
    .notEmpty()
    .withMessage("Classroom ID is required")
    .isMongoId()
    .withMessage("Invalid classroom ID"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["scheduled", "live"])
    .withMessage("Status must be either of scheduled or live"),

  body("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .isISO8601()
    .withMessage("Start time must be a valid ISO 8601 date")
    .toDate(),
];

export const updateLectureValidator = [
  /* ---------------- PARAM ---------------- */
  param("id").isMongoId().withMessage("Invalid lecture ID"),

  /* ---------------- OPTIONAL UPDATES ---------------- */
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty"),

  body("status")
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

  body("newStartTime")
    .optional()
    .isISO8601()
    .withMessage("newStartTime must be a valid ISO date")
    .toDate(),

  body("reason")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Delay reason cannot be empty"),

  /* ---------------- CONDITIONAL RULES ---------------- */

  // delayed → reason required
  body("reason")
    .if(body("status").isIn(["delayed", "cancelled"]))
    .notEmpty()
    .withMessage("Delay reason is required when lecture is delayed"),

  // scheduled / rescheduled → newStartTime required
  body("newStartTime")
    .if(body("status").isIn(["scheduled", "rescheduled"]))
    .notEmpty()
    .withMessage(
      "newStartTime is required for scheduled or rescheduled lectures"
    ),

  /* ---------------- AT LEAST ONE FIELD ---------------- */
  body().custom((body) => {
    if (!body.status && !body.title && !body.newStartTime && !body.reason) {
      throw new Error("At least one field must be provided for update");
    }
    return true;
  }),
];

