import { query, param, body } from "express-validator";

export const validateGetNotes = [
  query("status")
    .optional()
    .isIn(["active", "archived", "trashed", "all"])
    .withMessage("Invalid status. Must be 'active', 'archived', 'trashed' or 'all"),
];


export const addCollaboratorValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid note ID"),

  body("userEmail")
    .isEmail()
    .withMessage("A valid user email is required"),

  body("access")
    .isIn(["view", "edit"])
    .withMessage("Access must be either 'view' or 'edit'"),
];
