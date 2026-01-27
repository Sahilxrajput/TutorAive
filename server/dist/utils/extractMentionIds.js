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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractMentionedUserIds = extractMentionedUserIds;
const mongoose_1 = require("mongoose");
const user_model_1 = __importDefault(require("../models/user.model"));
function extractMentionedUserIds(content, authorId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!content)
            return [];
        const matches = content.matchAll(/@([a-zA-Z0-9_]{3,30})/g);
        const usernames = [...matches].map((m) => m[1].toLowerCase());
        if (usernames.length === 0)
            return [];
        // 2. Remove duplicates
        const uniqueUsernames = [...new Set(usernames)];
        // 3. Find users in DB
        const users = yield user_model_1.default.find({ userName: { $in: uniqueUsernames } }, { _id: 1 });
        const creatorId = new mongoose_1.Types.ObjectId(authorId);
        // 4. Map to IDs & filter self-mention
        const ids = users
            .map((u) => u._id)
            .filter((id) => !creatorId || !id.equals(creatorId));
        return ids;
    });
}
