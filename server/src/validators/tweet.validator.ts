import { body, param, query } from "express-validator";

export const createTweetValidator = [
  body("content").notEmpty().withMessage("Content is required"),
  body("title").notEmpty().withMessage("Title is required"),
  body("type")
    .optional()
    .isIn(["general", "mentorship", "news", "problem"])
    .withMessage("Invalid tweet type"),

  body("classroom").optional().isMongoId(),
//   body("problemId").optional().isMongoId(), //? @remind think about it  
];

export const tweetIdValidator = [
  param("id").isMongoId().withMessage("Invalid tweet ID"), //  @fix
];

// 