import { body, param, query } from "express-validator";

export const createTweetValidator = [
  body("content").notEmpty().withMessage("Content is required"),
  body("type")
    .optional()
    .isIn(["general", "mentorship", "news", "problem"])
    .withMessage("Invalid tweet type"),
];

export const tweetIdValidator = [
  param("id").isMongoId().withMessage("Invalid tweet ID"), //  @fix
];