import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { socketAuthMiddleware } from "../Middlewares/socketAuth";
import { onJoinRoom } from "./handlers/joinRoom";
import { createWebRtcTransport } from "./utils";
import { getRoom, rooms } from "../managers/RoomManager";
import { getPeerBySocket } from "../managers/PeerManager";
import { Transport } from "mediasoup/node/lib/types";

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
    console.log(`User ${userId} joined user:${userId}`);

    socket.on("join-room", (data, cb) => onJoinRoom(socket, data, cb)); // name, socketId, userId

    socket.on("createWebRtcTransport", async ({ isSender, roomId }, cb) => {
      console.log(`Is this a sender request? ${isSender}`);

      const room = rooms.get(roomId);
      if (!room) return cb({ error: "room not found" });

      const peer = room.getPeer(socket.id);
      if (!peer) return cb({ error: "peer not found" });

      if (!room.router) return cb({ error: "room router not found" });

      const transport = await createWebRtcTransport(room.router);
      if (!transport) return cb({ error: "error while creating transport" });

      console.log("transport received successfully");

      if (isSender) {
        peer.upTransport = transport;
        console.log("up transport set successfully");
      } else if (!isSender) {
        peer.downTransport = transport; //@issue ?
        console.log("down transport set successfully");
      } else {
        console.log("nothing set");
      }

      return cb({
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
      });
    });

    //transport-connect
    socket.on(
      "transport-connect",
      async ({ transportId, dtlsParameters, roomId }, cb) => {
        try {
          // console.log(
          //   "request on server to connect-transport DTLS PARAMS : ",
          //   dtlsParameters
          // );
          console.log(
            "request on server to connect-transport transportId : ",
            transportId
          );
          const room = getRoom(roomId);
          if (!room) return cb({ error: "room not found" });
          //   const producer = room.getProducer();

          const transport = room.getTransportById(transportId);
          if (!transport) return cb({ error: "transport not found" });

          await transport.connect({ dtlsParameters });

          console.log(`transport connected successfully`);
          cb({ connect: true });
          //   cb({ producer: producer }); //@note can be removed
        } catch (error) {
          console.log(error);
          cb({ error: error });
        }
      }
    );

    //transport-produce
    socket.on(
      "transport-produce",
      async ({ roomId, kind, transportId, rtpParameters, appData }, cb) => {
        console.log("request to create producer");

        const room = getRoom(roomId);
        if (!room) return cb({ error: "room not found" });

        const transport = room.getTransportById(transportId);
        if (!transport) return cb({ error: "transport not found" });

        const producer = await transport.produce({
          kind,
          rtpParameters,
          appData,
        });

        const host = getPeerBySocket(socket.id); //@note this user should be present in a unique classroom not at anywhere else
        if (!host) return cb({ error: "peer not found" });

        if (appData.mediaTag === "cam-video") {
          host.producer.cam = producer;
          console.log("[producer] cam producer set : ", producer.id);
        } else if (appData.mediaTag === "mic-audio") {
          host.producer.mic = producer;
          console.log("[producer] mic producer set : ", producer.id);
        } else if (appData.mediaTag === "screen-video") {
          host.producer.screen = producer;
          console.log("[producer] shared screen producer set : ", producer.id);
        } else if (appData.mediaTag === "screen-audio") {
          host.producer.saudio = producer;
          console.log(
            "[producer] shared screen audio producer set : ",
            producer.id
          );
        }

        console.log("Producer ID: ", producer.id);

        producer.on("transportclose", () => {
          console.log("transport for this producer closed ");
          producer.close();
        });

        // Send back to the client the Producer's id
        return cb({ id: producer.id });
      }
    );

    //consume
    socket.on(
      "consume",
      async ({ rtpCapabilities, roomId, producerId }, cb) => {
        try {
          const room = getRoom(roomId);
          if (!room) {
            console.log("[server] consume failed: room not found", roomId);
            return cb({ error: "room not found" });
          }

          const peer = getPeerBySocket(socket.id);
          if (!peer) {
            console.log("peer not found in this room", socket.id);
            return cb({ error: "peer not found" });
          }

          const transport = peer.downTransport;
          if (!transport) {
            console.log(
              "[server] consume failed: no recv transport for peer",
              socket.id
            );
            return cb({ error: "no recv transport" });
          }

          if (!room.host) {
            console.log(
              "[server] consume failed: producer/host not found in room"
            );
            return cb({ error: "producer not found" });
          }

          const producerExists = room.getProducer(); //  .some((p) => p?.id === producerId);
          if (!producerExists) {
            console.log(
              "[server] consume failed: producer not found in room",
              producerId
            );
            return cb({ error: "producer not found" });
          }

          if (!room.router) return console.log("room router doesn't exist");

          console.log("Producer ID:", producerId);
          console.log("Router producers:", producerExists);
          //   console.log("Peer RTP caps:", rtpCapabilities);

          const res = room.router.canConsume({
            producerId,
            rtpCapabilities,
          });

          console.log("canconsume : ", res);

          // transport can now consume and return a consumer
          const consumer = await transport.consume({
            producerId,
            rtpCapabilities,
            paused: true,
          });

          // @fix we already push user in room, we have to push user only if connection made succefully
          //   addPeer(socket.id ,roomId)
          console.log("[server] consume success, returning consumer params", {
            consumerId: consumer.id,
          });
          consumer.on("transportclose", () => {
            console.log("transport close from consumer");
          });

          consumer.on("producerclose", () => {
            console.log("producer of consumer closed");
          });

          // from the consumer extract the following params
          // to send back to the Client
          // send the parameters to the client
          cb({
            id: consumer.id,
            producerId,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters,
          });
        } catch (error: any) {
          console.log(error);
          cb({
            error: error,
          });
        }
      }
    );

    socket.on("consumer-resume", async ({ roomId, consumerId }) => {
      const room = getRoom(roomId);
      if (!room) return;
      const consumer = room.getConsumerById(consumerId);
      if (consumer) {
        console.log("resume video");
        await consumer.resume();
      }
    });

    socket.on("get-producres", async ({ roomId }, cb) => {
      try {
        let room = getRoom(roomId);
        if (!room) return console.log("room not exist");
        const producers = room.getProducer();
        cb(producers);
      } catch (error) {
        console.log("error in getting producers : ");
      }
    });

    socket.on("join:classroom", (classroomId: string) => {
      socket.join(classroomId);
    });

    socket.on("leave:classroom", (classroomId: string) => {
      socket.leave(classroomId);
    });

    // socket.on("leave-room", () => onLeaveRoom(socket));

    // socket.on("get-peers", (roomId) => onGetPeers(socket, roomId));

    // socket.on("disconnect", () => onDisconnect(socket));
  });
  //   return { io, classroom };
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io.of("/classroom");
};
