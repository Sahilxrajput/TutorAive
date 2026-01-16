import { Socket } from "socket.io";
import { liveQnA, LiveQuestion } from "../store/liveStore";

export const registerQnaSocket = (socket: Socket) => {
  socket.on(
    "qna:ask",
    ({ lectureId, question, userId, userName, userProfilePicture }, cb) => {
      const qnaRoom = liveQnA.get(lectureId) ?? new Map();

      const q: LiveQuestion = {
        _id: crypto.randomUUID(),
        userId,
        userName,
        question,
        userProfilePicture,
        upvotes: 0,
        isAnswered: false,
        createdAt: new Date(),
        upvotedUsers: new Set<string>(),
      };

      qnaRoom.set(q._id, q);
      liveQnA.set(lectureId, qnaRoom);

      socket.to(lectureId).emit("qna:new", q);
      cb({ question: q });
    }
  );

  socket.on("qna:upvote", ({ lectureId, questionId, userId }) => {
    const qnaRoom = liveQnA.get(lectureId);
    if (!qnaRoom) return;

    const q = qnaRoom.get(questionId);
    if (!q) return;

    if (q.upvotedUsers.has(userId)) return;

    q.upvotedUsers.add(userId);
    q.upvotes++;

    socket.to(lectureId).emit("qna:update", {
      questionId,
      upvotes: q.upvotes,
    });
  });

  socket.on("qna:mark-answered", ({ lectureId, questionId }) => {
    const qnaRoom = liveQnA.get(lectureId);
    if (!qnaRoom) return;

    const q = qnaRoom.get(questionId);
    if (!q) return;

    q.isAnswered = true;

    socket.to(lectureId).emit("qna:answered", {
      questionId,
    });
  });

  socket.on("qna:sync", ({ lectureId }, cb) => {
    const qnaRoom = liveQnA.get(lectureId);
    cb({
      questions: qnaRoom ? [...qnaRoom.values()] : [],
    });
  });

  socket.on("class:finish", async ({ lectureId }) => {
    const qnaRoom = liveQnA.get(lectureId);
    if (!qnaRoom) return;

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

    liveQnA.delete(lectureId);
  });
};
