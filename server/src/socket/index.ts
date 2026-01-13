import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { socketAuthMiddleware } from "../Middlewares/socketAuth";
import { handleJoinLiveSession } from "./handlers/joinLiveSession.handler";
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
import { handleLeaveLiveSession } from "./handlers/leaveLiveSession.handler";

export let io: Server | null = null;

export const initSocket = async (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      //   origin: "*",
      credentials: true, //@remind
    },
  });

  const classroom = io.of("/classroom");
  classroom.use(socketAuthMiddleware);

  classroom.on("connection", (socket: Socket) => {
    console.log("Somthing connected!", socket.id);
    const userId = socket.data.userId;

    if (!userId) {
      console.error("Socket connected WITHOUT userId");
      socket.disconnect(true);
      return;
    }

    socket.join(`user:${userId}`);
    // console.log(`User ${userId} joined user:${userId}`);

    socket.on("join:live-session", handleJoinLiveSession(socket));

    socket.on("createWebRtcTransport", handleCreateWebRtcTransport(socket));

    socket.on("transport-connect", handleTransportConnect());

    socket.on("transport-produce", handleTransportProduce(socket));

    socket.on("consume", handleConsume(socket));

    socket.on("consumer-resume", handleConsumerResume(socket));

    socket.on("get-producres", handleGetProducers());

    socket.on("leave:live-session", handleLeaveLiveSession(socket));

    socket.on("join:classroom", (classroomId: string) => {
      socket.join(classroomId);
    });

    socket.on("join-lecture", async ({ lectureId, classroomId }) => {
      await Attendance.findOneAndUpdate(
        { lectureId, classroom: classroomId, student: userId },
        {
          status: "present",
          joinTime: new Date(),
        }
      );
    });

    socket.on("leave-lecture", async ({ lectureId, classroomId }) => {
      await Attendance.findOneAndUpdate(
        { lectureId, classroom: classroomId, student: userId },
        {
          leaveTime: new Date(),
        }
      );
    });

    // socket.on("leave-room", () => onLeaveRoom(socket));

    // socket.on("get-peers", (roomId) => onGetPeers(socket, roomId));

    // socket.on("disconnect", () => onDisconnect(socket));
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io.of("/classroom");
};
