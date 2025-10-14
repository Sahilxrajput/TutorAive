"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const VideoSessionSchema = new mongoose_1.Schema({
    classroom: {
        type: mongoose_1.Types.ObjectId,
        ref: "Classroom",
        required: true,
        index: true,
    },
    title: String,
    createdBy: { type: mongoose_1.Types.ObjectId, ref: "User", required: true },
    startedAt: Date,
    endedAt: Date,
    provider: { type: String, default: "webrtc" },
    providerRoomId: { type: String, index: true },
    participants: [
        {
            user: { type: mongoose_1.Types.ObjectId, ref: "User" },
            joinAt: { type: Date, default: Date.now },
            leaveAt: Date,
            role: {
                type: String,
                enum: ["student", "instructor", "admin"],
                default: "student",
            },
        },
    ],
    isRecorded: { type: Boolean, default: false },
    meta: mongoose_1.Schema.Types.Mixed, // extra metadata for a video session (meta: { resolution: '1080p', fps: 30 })
}, { timestamps: true });
const VideoSession = mongoose_1.models.VideoSession || (0, mongoose_1.model)("VideoSession", VideoSessionSchema);
exports.default = VideoSession;
