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
exports.registerQnaSocket = void 0;
const liveStore_1 = require("../store/liveStore");
const registerQnaSocket = (socket) => {
    socket.on("qna:ask", ({ lectureId, question, userId, userName, userProfilePicture }, cb) => {
        var _a;
        if (socket.data.activeRoomId !== lectureId)
            return;
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
        socket.to(lectureId).emit("qna:new", q);
        cb({ question: q });
    });
    socket.on("qna:upvote", ({ lectureId, questionId, userId }) => {
        if (socket.data.activeRoomId !== lectureId)
            return;
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
        socket.to(lectureId).emit("qna:update", {
            questionId,
            upvotes: q.upvotes,
        });
    });
    socket.on("qna:mark-answered", ({ lectureId, questionId }) => {
        if (socket.data.activeRoomId !== lectureId)
            return;
        const qnaRoom = liveStore_1.liveQnA.get(lectureId);
        if (!qnaRoom)
            return;
        const q = qnaRoom.get(questionId);
        if (!q)
            return;
        q.isAnswered = true;
        socket.to(lectureId).emit("qna:answered", {
            questionId,
        });
    });
    socket.on("qna:sync", ({ lectureId }, cb) => {
        if (socket.data.activeRoomId !== lectureId)
            return;
        const qnaRoom = liveStore_1.liveQnA.get(lectureId);
        cb({
            questions: qnaRoom ? [...qnaRoom.values()] : [],
        });
    });
    socket.on("class:finish", (_a) => __awaiter(void 0, [_a], void 0, function* ({ lectureId }) {
        if (socket.data.activeRoomId !== lectureId)
            return;
        const qnaRoom = liveStore_1.liveQnA.get(lectureId);
        if (!qnaRoom)
            return;
        const questionsToSave = [...qnaRoom.values()].map((q) => ({
            lectureId,
            userId: q.userId,
            userName: q.userName,
            question: q.question,
            upvotes: q.upvotes,
            isAnswered: q.isAnswered,
            createdAt: q.createdAt,
        }));
        //@note think it should be save or not?
        // await QnaModel.insertMany(questionsToSave);
        liveStore_1.liveQnA.delete(lectureId);
    }));
};
exports.registerQnaSocket = registerQnaSocket;
