"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCollaboratorValidator = exports.validateGetNotes = void 0;
const express_validator_1 = require("express-validator");
exports.validateGetNotes = [
    (0, express_validator_1.query)("status")
        .optional()
        .isIn(["active", "archived", "trashed", "other"])
        .withMessage("Invalid status. Must be 'active', 'archived', 'trashed' or 'other"),
];
exports.addCollaboratorValidator = [
    (0, express_validator_1.param)("id")
        .isMongoId()
        .withMessage("Invalid note ID"),
    // body("userEmail") @fix kmc.du.ac.in not accessable
    //   .isEmail()
    //   .withMessage("A valid user email is required"),
    (0, express_validator_1.body)("access")
        .isIn(["view", "edit"])
        .withMessage("Access must be either 'view' or 'edit'"),
];
