import { Socket } from "socket.io";
import { LivePoll, livePolls } from "../store/liveStore";

interface VotePoll {
  lectureId: string;
  pollId: string;
  optionId: string;
}

export const registerPollSocket = (socket: Socket) => {
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

  socket.on(
    "poll:create",
    (
      { lectureId, question, options },
      cb?: (res: any) => void
    ) => {
      try {
        if (socket.data.activeRoomId !== lectureId) {
          return cb?.({ error: "Not inside lecture" });
        }

        if (!question || !Array.isArray(options) || options.length < 2) {
          return cb?.({ error: "Invalid poll data" });
        }

        const poll: LivePoll = {
          _id: crypto.randomUUID(),
          question,
          options: options.map((text: string) => ({
            _id: crypto.randomUUID(),
            text,
            votes: 0,
          })),
          isActive: true,
          votedUsers: new Map(),
        };

        if (!livePolls.has(lectureId)) {
          livePolls.set(lectureId, new Map());
        }

        livePolls.get(lectureId)!.set(poll._id, poll);

        // Send safe public version
        const publicPoll = {
          _id: poll._id,
          question: poll.question,
          options: poll.options,
          isActive: poll.isActive,
        };

        socket.to(lectureId).emit("poll:created", publicPoll);

        cb?.({ success: true, poll: publicPoll });

      } catch (err) {
        console.error("poll:create error:", err);
        cb?.({ error: "Failed to create poll" });
      }
    }
  );

  
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

  socket.on("poll:vote", ({ lectureId, pollId, optionId }: VotePoll) => {
    const userId = socket.data.userId;
    if (socket.data.activeRoomId !== lectureId) return;

    const lecturePolls = livePolls.get(lectureId);
    if (!lecturePolls) return;

    const poll = lecturePolls.get(pollId);
    if (!poll || !poll.isActive) return;

    // prevent double voting
    if (poll.votedUsers.has(userId)) return;

    const option = poll.options.find((o) => o._id === optionId);
    if (!option) return;

    option.votes += 1;
    poll.votedUsers.set(userId, optionId);

    socket.to(lectureId).emit("poll:updated", poll); //@note maybe can ignore frontend do the job
  });
};
