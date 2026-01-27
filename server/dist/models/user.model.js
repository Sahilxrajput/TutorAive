"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    userName: {
        type: String,
        trim: true,
        unique: true,
        default: () => `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    },
    oauthProvider: {
        type: String,
        enum: ["google", "github", "facebook", "discord", null],
    },
    oauthId: {
        type: String,
        unique: false,
        sparse: true, // allows multiple docs with null
    },
    profilePicture: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: function () {
            return !this.oauthProvider;
        },
        select: false,
    },
    enrolledClassrooms: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "Classroom",
        },
    ],
    assignments: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "Assignment",
        },
    ],
    notes: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "AssignmenNote",
        },
    ],
    role: {
        type: String,
        enum: ["student", "instructor", "admin"],
        default: "student",
    },
    refreshToken: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
});
// Compound index to enforce unique (oauthProvider, oauthId)
userSchema.index({ oauthProvider: 1, oauthId: 1 }, { unique: true, sparse: true });
const User = mongoose_1.models.User || (0, mongoose_1.model)("User", userSchema);
exports.default = User;
