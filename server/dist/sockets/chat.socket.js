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
exports.registerChatSocket = void 0;
const liveStore_1 = require("../store/liveStore");
const registerChatSocket = (socket) => {
    socket.on("chat:sync", ({ lectureId }, cb) => {
        var _a;
        if (socket.data.activeRoomId !== lectureId)
            return;
        const messages = (_a = liveStore_1.liveChats.get(lectureId)) !== null && _a !== void 0 ? _a : [];
        cb({ messages });
    });
    socket.on("chat:send", ({ lectureId, message, user }, cb) => {
        var _a;
        if (socket.data.activeRoomId !== lectureId)
            return;
        if (!(message === null || message === void 0 ? void 0 : message.trim()))
            return;
        console.log("socket.data.activeRoomId: ", socket.data.activeRoomId);
        const msg = {
            _id: crypto.randomUUID(),
            lectureId,
            userId: user._id,
            userName: user.userName,
            userProfilePicture: user.profilePicture,
            role: user.role, // "student" | "instructor"
            message,
            createdAt: new Date(),
        };
        const chat = (_a = liveStore_1.liveChats.get(lectureId)) !== null && _a !== void 0 ? _a : [];
        chat.push(msg);
        liveStore_1.liveChats.set(lectureId, chat);
        // send to everyone INCLUDING sender
        socket.to(lectureId).emit("chat:new", msg); //@note in or to
        cb === null || cb === void 0 ? void 0 : cb({ msg });
    });
    socket.on("class:finish", (_a) => __awaiter(void 0, [_a], void 0, function* ({ lectureId }) {
        if (socket.data.activeRoomId !== lectureId)
            return;
        const chat = liveStore_1.liveChats.get(lectureId);
        if (!chat)
            return;
        const chats = chat.map((m) => ({
            lectureId,
            userId: m.userId,
            userName: m.userName,
            role: m.role,
            message: m.message,
            createdAt: m.createdAt,
        }));
        //  await ChatMessageModel.insertMany(chats);
        liveStore_1.liveChats.delete(lectureId);
    }));
};
exports.registerChatSocket = registerChatSocket;
