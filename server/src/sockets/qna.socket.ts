import { Namespace, Socket } from "socket.io";
import { liveQnA, LiveQuestion } from "../store/liveStore";

interface AskPayload {
  lectureId: string;
  question: string;
  userId: string;
  userName: string;
  userProfilePicture: string;
}

interface UpvotePayload {
  lectureId: string;
  questionId: string;
  userId: string;
}

interface MarkAnsweredPayload {
  lectureId: string;
  questionId: string;
}

export const registerQnaSocket = (classroom: Namespace, socket: Socket) => {
  /* ================= ASK QUESTION ================= */
  socket.on("qna:ask", (data: AskPayload, cb) => {
    try {
      const { lectureId, question, userId, userName, userProfilePicture } =
        data;

      if (socket.data.activeRoomId !== lectureId) {
        return cb?.({ error: "User not in room" });
      }

      if (!question?.trim() || !userId) {
        return cb?.({ error: "Invalid question data" });
      }

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

      // Broadcast to everyone in namespace room (including sender)
      classroom.to(lectureId).emit("qna:new", q);
      cb?.({ success: true });
    } catch (err) {
      cb?.({ error: "Failed to ask question" });
    }
  });

  /* ================= UPVOTE ================= */
  socket.on("qna:upvote", (data: UpvotePayload, cb) => {
    try {
      const { lectureId, questionId, userId } = data;

      if (socket.data.activeRoomId !== lectureId) {
        return cb?.({ error: "User not in room" });
      }

      const qnaRoom = liveQnA.get(lectureId);
      if (!qnaRoom) return;

      const q = qnaRoom.get(questionId);
      if (!q) return;

      if (q.upvotedUsers.has(userId)) return;

      q.upvotedUsers.add(userId);
      q.upvotes++;

      classroom.to(lectureId).emit("qna:update", {
        questionId,
        upvotes: q.upvotes,
      });

      cb?.({ success: true });
    } catch (err) {
      cb?.({ error: "Upvote failed" });
    }
  });

  /* ================= MARK ANSWERED ================= */
  socket.on("qna:mark-answered", (data: MarkAnsweredPayload, cb) => {
    try {
      const { lectureId, questionId } = data;

      if (socket.data.activeRoomId !== lectureId) {
        return cb?.({ error: "User not in room" });
      }

      const qnaRoom = liveQnA.get(lectureId);
      if (!qnaRoom) return;

      const q = qnaRoom.get(questionId);
      if (!q) return;

      q.isAnswered = true;

      classroom.to(lectureId).emit("qna:answered", {
        questionId,
      });
      cb?.({ success: true });
    } catch (err) {
      cb?.({ error: "Failed to mark answered" });
    }
  });

  /* ================= SYNC ================= */
  socket.on("qna:sync", ({ lectureId }, cb) => {
    if (socket.data.activeRoomId !== lectureId) {
      return cb?.({ error: "User not in room" });
    }

    const qnaRoom = liveQnA.get(lectureId);

    cb?.({
      questions: qnaRoom ? [...qnaRoom.values()] : [],
    });
  });
};
