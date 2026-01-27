"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidation = void 0;
const express_validator_1 = require("express-validator");
const handleValidation = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log("error: ", errors);
        return res.status(400).json({
            success: false,
            errors: errors.array().map((err) => ({
                type: err.type,
                message: err.msg,
            })),
        });
    }
    next();
};
exports.handleValidation = handleValidation;
