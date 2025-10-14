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
        default: "",
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
        select: false
    },
    classrooms: [
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
    role: {
        type: String,
        enum: ["student", "instructor", "admin"],
        default: "student",
    },
}, {
    timestamps: true,
});
// 🔒 Compound index to enforce unique (oauthProvider, oauthId)
userSchema.index({ oauthProvider: 1, oauthId: 1 }, { unique: true, sparse: true });
const User = mongoose_1.models.User || (0, mongoose_1.model)("User", userSchema);
exports.default = User;
