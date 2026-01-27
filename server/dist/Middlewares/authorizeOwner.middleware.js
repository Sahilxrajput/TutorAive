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
        const resourceId = req.params.id ||
            req.params.assignmentId ||
            req.params.lectureId ||
            req.params.classroomId;
        const resource = yield (0, authorizeOwner_1.authorizeOwner)({
            resourceType,
            resourceId: resourceId,
            userId: req.userId,
        });
        req.authorizedResource = resource;
        next();
    }
    catch (err) {
        res.status(err.status || 500).json({
            success: false,
            message: err.message,
        });
    }
});
exports.authorizeOwnerMiddleware = authorizeOwnerMiddleware;
