import { Socket, Namespace } from "socket.io";
import { LivePoll, livePolls } from "../store/liveStore";

interface VotePoll {
  lectureId: string;
  pollId: string;
  optionId: string;
}

export const registerPollSocket = (classroom: Namespace, socket: Socket) => {
  socket.on(
    "poll:create",
    ({ lectureId, question, options }, cb?: (res: any) => void) => {
      try {
        if (socket.data.activeRoomId !== lectureId) {
          return cb?.({ error: "Not inside lecture" });
        }

        if (!question || !Array.isArray(options) || options.length < 2) {
          console.log("invalid poll data");
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

        const publicPoll = {
          _id: poll._id,
          question: poll.question,
          options: poll.options,
          isActive: poll.isActive,
          totalVotes: 0,
        };

        console.log("publicPoll", publicPoll);
        classroom.to(lectureId).emit("poll:created", publicPoll);

        cb?.({ success: true});
      } catch (err) {
        console.error("poll:create error:", err);
        cb?.({ error: "Failed to create poll" });
      }
    },
  );

  socket.on("poll:vote", ({ lectureId, pollId, optionId }: VotePoll) => {
    const userId = socket.data.userId;
    if (!userId || socket.data.activeRoomId !== lectureId) return;

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

    const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);

    const publicPoll = {
      _id: poll._id,
      question: poll.question,
      options: poll.options,
      isActive: poll.isActive,
      totalVotes,
    };

    socket.to(lectureId).emit("poll:updated", publicPoll);
  });
};
