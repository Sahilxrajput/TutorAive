"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerQnaSocket = void 0;
const liveStore_1 = require("../store/liveStore");
const registerQnaSocket = (classroom, socket) => {
    /* ================= ASK QUESTION ================= */
    socket.on("qna:ask", (data, cb) => {
        var _a;
        try {
            const { lectureId, question, userId, userName, userProfilePicture } = data;
            if (socket.data.activeRoomId !== lectureId) {
                return cb === null || cb === void 0 ? void 0 : cb({ error: "User not in room" });
            }
            if (!(question === null || question === void 0 ? void 0 : question.trim()) || !userId) {
                return cb === null || cb === void 0 ? void 0 : cb({ error: "Invalid question data" });
            }
            const qnaRoom = (_a = liveStore_1.liveQnA.get(lectureId)) !== null && _a !== void 0 ? _a : new Map();
            const q = {
                _id: crypto.randomUUID(),
                userId,
                userName,
                question,
                userProfilePicture,
                upvotes: 0,
                isAnswered: false,
                createdAt: new Date(),
                upvotedUsers: new Set(),
            };
            qnaRoom.set(q._id, q);
            liveStore_1.liveQnA.set(lectureId, qnaRoom);
            // Broadcast to everyone in namespace room (including sender)
            classroom.to(lectureId).emit("qna:new", q);
            cb === null || cb === void 0 ? void 0 : cb({ success: true });
        }
        catch (err) {
            cb === null || cb === void 0 ? void 0 : cb({ error: "Failed to ask question" });
        }
    });
    /* ================= UPVOTE ================= */
    socket.on("qna:upvote", (data, cb) => {
        try {
            const { lectureId, questionId, userId } = data;
            if (socket.data.activeRoomId !== lectureId) {
                return cb === null || cb === void 0 ? void 0 : cb({ error: "User not in room" });
            }
            const qnaRoom = liveStore_1.liveQnA.get(lectureId);
            if (!qnaRoom)
                return;
            const q = qnaRoom.get(questionId);
            if (!q)
                return;
            if (q.upvotedUsers.has(userId))
                return;
            q.upvotedUsers.add(userId);
            q.upvotes++;
            classroom.to(lectureId).emit("qna:update", {
                questionId,
                upvotes: q.upvotes,
            });
            cb === null || cb === void 0 ? void 0 : cb({ success: true });
        }
        catch (err) {
            cb === null || cb === void 0 ? void 0 : cb({ error: "Upvote failed" });
        }
    });
    /* ================= MARK ANSWERED ================= */
    socket.on("qna:mark-answered", (data, cb) => {
        try {
            const { lectureId, questionId } = data;
            if (socket.data.activeRoomId !== lectureId) {
                return cb === null || cb === void 0 ? void 0 : cb({ error: "User not in room" });
            }
            const qnaRoom = liveStore_1.liveQnA.get(lectureId);
            if (!qnaRoom)
                return;
            const q = qnaRoom.get(questionId);
            if (!q)
                return;
            q.isAnswered = true;
            classroom.to(lectureId).emit("qna:answered", {
                questionId,
            });
            cb === null || cb === void 0 ? void 0 : cb({ success: true });
        }
        catch (err) {
            cb === null || cb === void 0 ? void 0 : cb({ error: "Failed to mark answered" });
        }
    });
    /* ================= SYNC ================= */
    socket.on("qna:sync", ({ lectureId }, cb) => {
        if (socket.data.activeRoomId !== lectureId) {
            return cb === null || cb === void 0 ? void 0 : cb({ error: "User not in room" });
        }
        const qnaRoom = liveStore_1.liveQnA.get(lectureId);
        cb === null || cb === void 0 ? void 0 : cb({
            questions: qnaRoom ? [...qnaRoom.values()] : [],
        });
    });
};
exports.registerQnaSocket = registerQnaSocket;
