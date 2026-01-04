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

  /* ---------------- BASIC FIELDS ---------------- */
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

  body("delayTime")
    .optional()
    .isInt({ min: 1, max: 120 })
    .withMessage("delayTime must be between 1 and 120 minutes"),

  body("reason")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Reason cannot be empty"),

  /* ---------------- CONDITIONAL RULES ---------------- */

  // delayed → delayTime + reason required
  body("delayTime")
    .if(body("status").equals("delayed"))
    .exists()
    .withMessage("delayTime is required when lecture is delayed")
    .bail()
    .isFloat({ gt: 0 })
    .withMessage("delayTime must be a positive number"),

  body("reason")
    .if(body("status").equals("delayed"))
    .exists()
    .withMessage("Delay reason is required"),

  // cancelled → reason required
  body("reason")
    .if(body("status").equals("cancelled"))
    .exists()
    .withMessage("Cancel reason is required"),

  // scheduled / rescheduled → newStartTime required
  body("newStartTime")
    .if(body("status").isIn(["scheduled", "rescheduled"]))
    .exists()
    .withMessage(
      "newStartTime is required for scheduled or rescheduled lectures"
    ),

  /* ---------------- FORBIDDEN COMBINATIONS ---------------- */
  body().custom((body) => {
    const { status, newStartTime, delayTime } = body;

    // delayed must NOT accept absolute time
    if (status === "delayed" && newStartTime) {
      throw new Error("newStartTime is not allowed when lecture is delayed");
    }

    // reschedule / schedule must NOT accept delayTime
    if ((status === "scheduled" || status === "rescheduled") && delayTime) {
      throw new Error(
        "delayTime is not allowed for scheduled or rescheduled lectures"
      );
    }

    // reason without status is meaningless
    if (body.reason && !status) {
      throw new Error("reason cannot be provided without status");
    }

    return true;
  }),

  /* ---------------- AT LEAST ONE FIELD ---------------- */
  body().custom((body) => {
    if (
      !body.status &&
      !body.title &&
      !body.newStartTime &&
      !body.delayTime &&
      !body.reason
    ) {
      throw new Error("At least one field must be provided for update");
    }
    return true;
  }),
];
