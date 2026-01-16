import { Socket } from "socket.io";
import { LiveChatMessage, liveChats } from "../store/liveStore";

export const  registerChatSocket = (socket: Socket) => {

   socket.on("chat:sync", ({ lectureId }, cb) => {
     const messages = liveChats.get(lectureId) ?? [];
     cb({ messages });
   });

   socket.on("chat:send", ({ lectureId, message, user }, cb) => {
     if (!message?.trim()) return;

     const msg: LiveChatMessage = {
       _id: crypto.randomUUID(),
       lectureId,
       userId: user._id,
       userName: user.userName,
       userProfilePicture: user.profilePicture,
       role: user.role, // "student" | "instructor"
       message,
       createdAt: new Date(),
     };

     const chat = liveChats.get(lectureId) ?? [];
     chat.push(msg);
     liveChats.set(lectureId, chat);

     // send to everyone INCLUDING sender
     socket.to(lectureId).emit("chat:new", msg); //@note in or to

     cb?.({ msg });
   });

   socket.on("class:finish", async ({ lectureId }) => {
     const chat = liveChats.get(lectureId);
     if (!chat) return;

     const chats = chat.map((m) => ({
       lectureId,
       userId: m.userId,
       userName: m.userName,
       role: m.role,
       message: m.message,
       createdAt: m.createdAt,
     }));

    //  await ChatMessageModel.insertMany(chats);

     liveChats.delete(lectureId);
   });

};
