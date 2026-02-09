"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const invitationSchema = new mongoose_1.Schema({
    classroom: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Classroom",
        required: true,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    inviteCode: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: Date,
    maxUses: { type: Number, default: 0 }, // maxUses = 0 means unlimited.
    usedBy: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }], // array tracks who used the link.
}, { timestamps: true });
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 3 } // 3 days
);
const Invitation = mongoose_1.models.Invitation || (0, mongoose_1.model)("Invitation", invitationSchema);
exports.default = Invitation;
