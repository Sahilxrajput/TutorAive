"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPollSocket = void 0;
const liveStore_1 = require("../store/liveStore");
const registerPollSocket = (socket) => {
    //   socket.on("poll:create", ({ lectureId, question, options }) => {
    //     if (socket.data.activeRoomId !== lectureId) return;
    //     const poll: LivePoll = {
    //       _id: crypto.randomUUID(),
    //       question,
    //       options: options.map((text: string) => ({
    //         _id: crypto.randomUUID(),
    //         text,
    //         votes: 0,
    //       })),
    //       isActive: true,
    //       votedUsers: new Map(),
    //     };
    //     if (!livePolls.has(lectureId)) {
    //       livePolls.set(lectureId, new Map());
    //     }
    //     livePolls.get(lectureId)!.set(poll._id, {
    //       ...poll,
    //       votedUsers: new Map(),
    //     });
    //     socket.to(lectureId).emit("poll:created", poll); //@note it sends to all students except the teacher use cb
    //   });
    socket.on("poll:create", ({ lectureId, question, options }, cb) => {
        try {
            if (socket.data.activeRoomId !== lectureId) {
                return cb === null || cb === void 0 ? void 0 : cb({ error: "Not inside lecture" });
            }
            if (!question || !Array.isArray(options) || options.length < 2) {
                console.log("invalid poll data");
                return cb === null || cb === void 0 ? void 0 : cb({ error: "Invalid poll data" });
            }
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
            liveStore_1.livePolls.get(lectureId).set(poll._id, poll);
            // Send safe public version
            const publicPoll = {
                _id: poll._id,
                question: poll.question,
                options: poll.options,
                isActive: poll.isActive,
            };
            console.log("publicPoll", publicPoll);
            socket.to(lectureId).emit("poll:created", publicPoll);
            cb === null || cb === void 0 ? void 0 : cb({ success: true, poll: publicPoll });
        }
        catch (err) {
            console.error("poll:create error:", err);
            cb === null || cb === void 0 ? void 0 : cb({ error: "Failed to create poll" });
        }
    });
    //   socket.on(
    //     "poll:vote",
    //     (
    //       { lectureId, pollId, optionId }: VotePoll,
    //       cb?: (res: any) => void
    //     ) => {
    //       try {
    //         const userId = socket.data.userId;
    //         if (!userId) {
    //           return cb?.({ error: "Unauthorized" });
    //         }
    //         if (socket.data.activeRoomId !== lectureId) {
    //           return cb?.({ error: "Not inside lecture" });
    //         }
    //         const lecturePolls = livePolls.get(lectureId);
    //         if (!lecturePolls) {
    //           return cb?.({ error: "Poll not found" });
    //         }
    //         const poll = lecturePolls.get(pollId);
    //         if (!poll || !poll.isActive) {
    //           return cb?.({ error: "Poll inactive" });
    //         }
    //         if (poll.votedUsers.has(userId)) {
    //           return cb?.({ error: "Already voted" });
    //         }
    //         const option = poll.options.find(o => o._id === optionId);
    //         if (!option) {
    //           return cb?.({ error: "Invalid option" });
    //         }
    //         option.votes += 1;
    //         poll.votedUsers.set(userId, optionId);
    //         const publicPoll = {
    //           _id: poll._id,
    //           question: poll.question,
    //           options: poll.options,
    //           isActive: poll.isActive,
    //         };
    //         socket.server.to(lectureId).emit("poll:updated", publicPoll);
    //         cb?.({ success: true });
    //       } catch (err) {
    //         console.error("poll:vote error:", err);
    //         cb?.({ error: "Vote failed" });
    //       }
    //     }
    //   );
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
