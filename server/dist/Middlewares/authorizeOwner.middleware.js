"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeOwnerMiddleware = void 0;
const authorizeOwner_1 = require("../utils/authorization/authorizeOwner");
const authorizeOwnerMiddleware = (resourceType) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure user is authenticated
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. User not authenticated.",
            });
        }
        // Map resource type to param name
        const paramMap = {
            lecture: "lectureId",
            assignment: "assignmentId",
            classroom: "classroomId",
        };
        const rawId = req.params[paramMap[resourceType]] || req.params.id;
        if (!rawId || Array.isArray(rawId)) {
            return res.status(400).json({
                success: false,
                message: `${resourceType} id is required`,
            });
        }
        const resourceId = rawId; // 
        const resource = yield (0, authorizeOwner_1.authorizeOwner)({
            resourceType,
            resourceId,
            userId: req.userId,
        });
        // attach resource for controller use
        req.authorizedResource = resource;
        next();
    }
    catch (err) {
        console.error("AuthorizeOwner Error:", err);
        res.status(err.status || 500).json({
            success: false,
            message: err.message || "Authorization failed",
        });
    }
});
exports.authorizeOwnerMiddleware = authorizeOwnerMiddleware;
