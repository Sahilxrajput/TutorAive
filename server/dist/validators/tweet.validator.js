"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tweetIdValidator = exports.createTweetValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createTweetValidator = [
    (0, express_validator_1.body)("content").notEmpty().withMessage("Content is required"),
    (0, express_validator_1.body)("type")
        .optional()
        .isIn(["general", "mentorship", "news", "problem"])
        .withMessage("Invalid tweet type"),
];
exports.tweetIdValidator = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Invalid tweet ID"), //  @fix
];
