"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPollSocket = void 0;
const liveStore_1 = require("../store/liveStore");
const registerPollSocket = (socket) => {
    socket.on("poll:create", ({ lectureId, question, options }) => {
        if (socket.data.activeRoomId !== lectureId)
            return;
        const poll = {
            _id: crypto.randomUUID(),
            question,
            options: options.map((text) => ({
                _id: crypto.randomUUID(),
                text,
                votes: 0,
            })),
            isActive: true,
            votedUsers: new Map(),
        };
        if (!liveStore_1.livePolls.has(lectureId)) {
            liveStore_1.livePolls.set(lectureId, new Map());
        }
        liveStore_1.livePolls.get(lectureId).set(poll._id, Object.assign(Object.assign({}, poll), { votedUsers: new Map() }));
        socket.to(lectureId).emit("poll:created", poll); //@note it sends to all students except the teacher use cb
    });
    socket.on("poll:vote", ({ lectureId, pollId, optionId }) => {
        const userId = socket.data.userId;
        if (socket.data.activeRoomId !== lectureId)
            return;
        const lecturePolls = liveStore_1.livePolls.get(lectureId);
        if (!lecturePolls)
            return;
        const poll = lecturePolls.get(pollId);
        if (!poll || !poll.isActive)
            return;
        // prevent double voting
        if (poll.votedUsers.has(userId))
            return;
        const option = poll.options.find((o) => o._id === optionId);
        if (!option)
            return;
        option.votes += 1;
        poll.votedUsers.set(userId, optionId);
        socket.to(lectureId).emit("poll:updated", poll); //@note maybe can ignore frontend do the job
    });
};
exports.registerPollSocket = registerPollSocket;
