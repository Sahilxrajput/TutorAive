import { Namespace, Socket } from "socket.io";
import { LiveChatMessage, liveChats } from "../store/liveStore";

interface SendPayload {
  lectureId: string;
  message: string;
  user: {
    _id: string;
    userName: string;
    profilePicture?: string;
    role: "student" | "instructor";
  };
}

interface SyncPayload {
  lectureId: string;
}

interface FinishPayload {
  lectureId: string;
}

export const registerChatSocket = (classroom: Namespace, socket: Socket) => {
  /* ================= SYNC ================= */
  socket.on("chat:sync", (data: SyncPayload, cb) => {
    try {
      const { lectureId } = data;

      if (socket.data.activeRoomId !== lectureId) {
        return cb?.({ error: "User not in room" });
      }

      const messages = liveChats.get(lectureId) ?? [];
      cb?.({ messages });
    } catch {
      cb?.({ error: "Failed to sync chat" });
    }
  });

  /* ================= SEND MESSAGE ================= */
  socket.on("chat:send", (data: SendPayload, cb) => {
    try {
      const { lectureId, message, user } = data;

      if (socket.data.activeRoomId !== lectureId) {
        return cb?.({ error: "User not in room" });
      }

      if (!message?.trim()) {
        return cb?.({ error: "Message cannot be empty" });
      }

      const msg: LiveChatMessage = {
        _id: crypto.randomUUID(),
        lectureId,
        userId: user._id,
        userName: user.userName,
        userProfilePicture: user.profilePicture,
        role: user.role,
        message,
        createdAt: new Date(),
      };

      const chatRoom = liveChats.get(lectureId) ?? [];
      chatRoom.push(msg);
      liveChats.set(lectureId, chatRoom);

      // Broadcast to everyone INCLUDING sender
      classroom.to(lectureId).emit("chat:new", msg);
      cb?.({ success: true });
    } catch {
      cb?.({ error: "Failed to send message" });
    }
  });

  /* ================= CLASS FINISH ================= */
  socket.on("class:finish", (data: FinishPayload) => {
    const { lectureId } = data;

    if (socket.data.activeRoomId !== lectureId) return;

    const chat = liveChats.get(lectureId);
    if (!chat) return;

    const chatsToSave = chat.map((m) => ({
      lectureId,
      userId: m.userId,
      userName: m.userName,
      role: m.role,
      message: m.message,
      createdAt: m.createdAt,
    }));

    //@follow-up await ChatMessageModel.insertMany(chatsToSave);

    liveChats.delete(lectureId);
  });
};
