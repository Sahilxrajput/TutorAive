import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { socketAuthMiddleware } from "../middlewares/socketAuth";
import { Consumer, Transport } from "mediasoup/node/lib/types";
import Attendance from "../models/attendence.model.";
import { roomManager } from "../managers/RoomManager";
import { handleCreateWebRtcTransport } from "./handlers/webrtcTransport.handler";
import { handleTransportConnect } from "./handlers/transportConnect.handler";
import { peerManager } from "../managers/PeerManager";
import { handleTransportProduce } from "./handlers/transportProduce.handler";
import { handleConsume } from "./handlers/consume.handler";
import { handleGetProducers } from "./handlers/getProducers.handler";
import { handleConsumerResume } from "./handlers/consumerResume.handler";
import { leaveStudentLiveSession } from "./handlers/leaveStudentLiveSession";
import { registerQnaSocket } from "./qna.socket";
import { registerChatSocket } from "./chat.socket";
import { registerPollSocket } from "./poll.socket";
import { registerSystemSocket } from "./system.socket";
import { leaveInstructorLiveSession } from "./handlers/leaveInstructorLiveSession";
import { handleStudentJoinLiveSession } from "./handlers/joinLiveSession.student.handler";
import { handleInstructorJoinLiveSession } from "./handlers/joinLiveSession.instructor.handler";

export let io: Server | null = null;

export const initSocket = async (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  const classroom = io.of("/classroom");
  classroom.use(socketAuthMiddleware);

  classroom.on("connection", (socket: Socket) => {
    console.log("Somthing connected!", socket.id);
    const userId = socket.data.userId;
    const isInstructor = socket.data.userRole === "instructor";

    if (!userId) {
      console.error("Socket connected WITHOUT userId");
      socket.disconnect(true);
      return;
    }

    socket.join(`user:${userId}`);
    // console.log(`User ${userId} joined user:${userId}`);

    socket.on(
      "join:live-session",
      isInstructor
        ? handleInstructorJoinLiveSession(socket)
        : handleStudentJoinLiveSession(socket),
    );

    socket.on("createWebRtcTransport", handleCreateWebRtcTransport(socket));

    socket.on("transport-connect", handleTransportConnect());

    socket.on("transport-produce", handleTransportProduce(socket));

    socket.on("consume", handleConsume(socket));

    socket.on("consumer-resume", handleConsumerResume(socket));

    socket.on("get-producres", handleGetProducers());

    socket.on(
      "leave:live-session",
      isInstructor
        ? leaveInstructorLiveSession(socket)
        : leaveStudentLiveSession(socket),
    );

    // socket.on("lecture:join", ({ lectureId, user }) => {
    //   socket.join(lectureId);

    //   emitSystemMessage(
    //     io,
    //     lectureId,
    //     `${user.userName} joined the live class`
    //   );
    // });

    // registered Sockets
    registerQnaSocket(socket);
    registerChatSocket(socket);
    registerPollSocket(socket);
    registerSystemSocket(socket);

    socket.on("join:classroom", (classroomId: string) => {
      socket.join(classroomId);
    });

    socket.on("join-lecture", async ({ lectureId, classroomId }) => {
      await Attendance.findOneAndUpdate(
        { lectureId, classroom: classroomId, student: userId },
        {
          status: "present",
          joinTime: new Date(),
        },
      );
    });

    socket.on("leave-lecture", async ({ lectureId, classroomId }) => {
      await Attendance.findOneAndUpdate(
        { lectureId, classroom: classroomId, student: userId },
        {
          leaveTime: new Date(),
        },
      );
    });

    socket.on(
      "disconnect",
      isInstructor
        ? leaveInstructorLiveSession(socket)
        : leaveStudentLiveSession(socket),
    );
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io.of("/classroom");
};
