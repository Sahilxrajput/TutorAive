"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerChatSocket = void 0;
const liveStore_1 = require("../store/liveStore");
const registerChatSocket = (classroom, socket) => {
    /* ================= SYNC ================= */
    socket.on("chat:sync", (data, cb) => {
        var _a;
        try {
            const { lectureId } = data;
            if (socket.data.activeRoomId !== lectureId) {
                return cb === null || cb === void 0 ? void 0 : cb({ error: "User not in room" });
            }
            const messages = (_a = liveStore_1.liveChats.get(lectureId)) !== null && _a !== void 0 ? _a : [];
            cb === null || cb === void 0 ? void 0 : cb({ messages });
        }
        catch (_b) {
            cb === null || cb === void 0 ? void 0 : cb({ error: "Failed to sync chat" });
        }
    });
    /* ================= SEND MESSAGE ================= */
    socket.on("chat:send", (data, cb) => {
        var _a;
        try {
            const { lectureId, message, user } = data;
            if (socket.data.activeRoomId !== lectureId) {
                return cb === null || cb === void 0 ? void 0 : cb({ error: "User not in room" });
            }
            if (!(message === null || message === void 0 ? void 0 : message.trim())) {
                return cb === null || cb === void 0 ? void 0 : cb({ error: "Message cannot be empty" });
            }
            const msg = {
                _id: crypto.randomUUID(),
                lectureId,
                userId: user._id,
                userName: user.userName,
                userProfilePicture: user.profilePicture,
                role: user.role,
                message,
                createdAt: new Date(),
            };
            const chatRoom = (_a = liveStore_1.liveChats.get(lectureId)) !== null && _a !== void 0 ? _a : [];
            chatRoom.push(msg);
            liveStore_1.liveChats.set(lectureId, chatRoom);
            // Broadcast to everyone INCLUDING sender
            classroom.to(lectureId).emit("chat:new", msg);
            cb === null || cb === void 0 ? void 0 : cb({ success: true });
        }
        catch (_b) {
            cb === null || cb === void 0 ? void 0 : cb({ error: "Failed to send message" });
        }
    });
    /* ================= CLASS FINISH ================= */
    socket.on("class:finish", (data) => {
        const { lectureId } = data;
        if (socket.data.activeRoomId !== lectureId)
            return;
        const chat = liveStore_1.liveChats.get(lectureId);
        if (!chat)
            return;
        const chatsToSave = chat.map((m) => ({
            lectureId,
            userId: m.userId,
            userName: m.userName,
            role: m.role,
            message: m.message,
            createdAt: m.createdAt,
        }));
        //@follow-up await ChatMessageModel.insertMany(chatsToSave);
        liveStore_1.liveChats.delete(lectureId);
    });
};
exports.registerChatSocket = registerChatSocket;
