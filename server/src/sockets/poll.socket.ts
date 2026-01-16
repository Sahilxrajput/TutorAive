import { Socket } from "socket.io";
import { LivePoll, livePolls } from "../store/liveStore";

interface VotePoll {
  lectureId: string;
  pollId: string;
  optionId: string;
}

export const registerPollSocket = (socket: Socket) => {
  socket.on("poll:create", ({ lectureId, question, options }) => {
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

    livePolls.get(lectureId)!.set(poll._id, {
      ...poll,
      votedUsers: new Map(),
    });
    socket.to(lectureId).emit("poll:created", poll); //@note it sends to all students except the teacher use cb
  });

  socket.on("poll:vote", ({ lectureId, pollId, optionId }: VotePoll) => {
    const userId = socket.data.userId;
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
