"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const resourceSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    file: {
        url: {
            type: String,
            required: true,
        },
        resourceType: String,
        publicId: {
            type: String,
            required: true,
        },
    },
    classroom: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Classroom",
        required: true,
    },
    uploadedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
const Resource = mongoose_1.models.Resource || (0, mongoose_1.model)("Resource", resourceSchema);
exports.default = Resource;
