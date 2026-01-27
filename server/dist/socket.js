"use strict";
// import { Server, Socket } from "socket.io";
// import {
//   addUser,
//   removeUser,
//   ISocketUser,
//   getOnlineUsers,
//   getUserById,
//   getUsersInRoom,
// } from "./utils/users";
// import { Server as HTTPServer } from "http";
// import { socketAuthMiddleware } from "./Middlewares/socketAuth";
// import * as mediasoup from "mediasoup";
// interface IMessage {
//   userId: string;
//   userName: string;
//   message: string;
//   roomId: string;
//   timestamp: string;
// }
// interface RoomInfo {
//   tutorId: string | null;
//   members: Record<string, "tutor" | "student">;
// }
// const connections = new Map<string, Set<string>>(); // roomId -> set of socketIds
// const timeOnline: { [socketId: string]: Date } = {};
// export const initSocket = (httpServer: HTTPServer) => {
//   const io = new Server(httpServer, {
//     cors: {
//       origin: process.env.CLIENT_URL,
//       credentials: true,
//     },
//   });
//   io.use(socketAuthMiddleware);
//   let worker: any;
//   let router: any;
//   let producerTransport: any;
//   let consumerTransport: any;
//   let producer: any;
//   let consumer: any;
//   async function createWorker() {
//     worker = await mediasoup.createWorker({
//       rtcMinPort: 40000,
//       rtcMaxPort: 49999,
//     });
//     console.log("worker pid : " + worker.pid);
//     worker.on("died", (err: any) => {
//       console.log("mediasoup has died");
//       setTimeout(() => process.exit(1), 2000);
//     });
//     return worker;
//   }
//   worker = createWorker();
//   const createWebRtcTransport = async (callback: any) => {
//     try {
//       // https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportOptions
//       const webRtcTransport_options = {
//         listenIps: [
//           {
//             ip: "0.0.0.0", // replace with relevant IP address
//             announcedIp: "127.0.0.1",
//           },
//         ],
//         enableUdp: true,
//         enableTcp: true,
//         preferUdp: true,
//         rtcpFeedback: {
//           nack: true,
//           pli: true,
//           remb: true,
//           transportCc: true,
//         },
//         initialAvailableOutgoingBitrate: 1000000,
//         maxIncomingBitrate: 1500000,
//         minPort: 40000,
//         maxPort: 40999,
//       };
//       // https://mediasoup.org/documentation/v3/mediasoup/api/#router-createWebRtcTransport
//       let transport = await router.createWebRtcTransport(
//         webRtcTransport_options
//       );
//       console.log(`transport id: ${transport.id}`);
//       transport.on("dtlsstatechange", (dtlsState: any) => {
//         if (dtlsState === "closed") {
//           transport.close();
//         }
//       });
//       transport.on("close", () => {
//         console.log("transport closed");
//       });
//       let params = {
//         id: transport.id,
//         iceParameters: transport.iceParameters,
//         iceCandidates: transport.iceCandidates,
//         dtlsParameters: transport.dtlsParameters,
//       };
//       // send back to the client the following prameters
//       callback(
//         // https://mediasoup.org/documentation/v3/mediasoup-client/api/#TransportOptions
//         params
//       );
//       return transport;
//     } catch (error) {
//       console.log(error);
//       callback({
//         error: error,
//       });
//     }
//   };
//   const mediaCodecs = [
//     {
//       kind: "audio",
//       mimeType: "audio/opus",
//       clockRate: 48000,
//       channels: 2,
//     },
//     {
//       kind: "video",
//       mimeType: "video/VP8",
//       clockRate: 90000,
//       parameters: {
//         "x-google-start-bitrate": 1000,
//       },
//     },
//   ];
//   io.on("connection", async (socket: Socket) => {
//     console.log("Something Connected:", socket.id);
//     socket.emit("connection-success", {
//       socketId: socket.id,
//       existProducer: producer ? true : false,
//     });
//     socket.on("createRoom", async (cb) => {
//       if (router === undefined) {
//         router = await worker.createRouter({ mediaCodecs });
//         console.log("Router Id : ", router.id);
//       }
//       // call callback from the client and send back the rtpCapabilities
//       cb(router.rtpCapabilities);
//     });
//     socket.on("createWebRtcTransport", async ({ sender }, cb) => {
//       console.log(`Is this a sender request? ${sender}`);
//       // The client indicates if it is a producer or a consumer
//       // if sender is true, indicates a producer else a consumer
//       if (sender) producerTransport = await createWebRtcTransport(cb);
//       else consumerTransport = await createWebRtcTransport(cb);
//     });
//     socket.on("transport-connect", async ({ dtlsParameters }) => {
//       console.log("DTLS PARAMS... ", { dtlsParameters });
//       await producerTransport.connect({ dtlsParameters });
//     });
//     //transport-produce
//     socket.on(
//       "transport-produce",
//       async ({ kind, rtpParameters, appData }, cb) => {
//         // call produce based on the prameters from the client
//         producer = await producerTransport.produce({
//           kind,
//           rtpParameters,
//         });
//         console.log("Producer ID: ", producer.id, producer.kind);
//         producer.on("transportclose", () => {
//           console.log("transport for this producer closed ");
//           producer.close();
//         });
//         // Send back to the client the Producer's id
//         cb(producer.id);
//       }
//     );
//     socket.on("transport-recv-connect", async ({ dtlsParameters }) => {
//       console.log(`DTLS PARAMS: ${dtlsParameters}`);
//       await consumerTransport.connect({ dtlsParameters });
//     });
//     socket.on("consume", async ({ rtpCapabilities }, cb) => {
//       try {
//         // check if the router can consume the specified producer
//         if (
//           router.canConsume({
//             producerId: producer.id,
//             rtpCapabilities,
//           })
//         ) {
//           // transport can now consume and return a consumer
//           consumer = await consumerTransport.consume({
//             producerId: producer.id,
//             rtpCapabilities,
//             paused: true,
//           });
//           consumer.on("transportclose", () => {
//             console.log("transport close from consumer");
//           });
//           consumer.on("producerclose", () => {
//             console.log("producer of consumer closed");
//           });
//           // from the consumer extract the following params
//           // to send back to the Client
//           const params = {
//             id: consumer.id,
//             producerId: producer.id,
//             kind: consumer.kind,
//             rtpParameters: consumer.rtpParameters,
//           };
//           // send the parameters to the client
//           cb(params);
//         }
//       } catch (error: any) {
//         console.log(error);
//         cb({
//           error: error,
//         });
//       }
//     });
//     socket.on("consumer-resume", async () => {
//       console.log("consumer resume");
//       await consumer.resume();
//     });
//     // --- JOIN ROOM ---
//     socket.on("join_room", (roomId: string) => {
//       console.log("user joined room:", roomId);
//       // ensure room entry exists
//       if (!connections.has(roomId)) connections.set(roomId, new Set());
//       connections.get(roomId)!.add(socket.id);
//       timeOnline[socket.id] = new Date();
//       // Add user to your app-level online list
//       const newUser: ISocketUser = {
//         userId: socket.data.userId,
//         userName: socket.data.userName,
//         roomId,
//         socketId: socket.id,
//       };
//       addUser(newUser);
//       // Actually join Socket.IO room
//       socket.join(roomId);
//       // Notify everyone in the room (including the new user if you want)
//       io.in(roomId).emit("user_joined", { userId: socket.id });
//       io.in(roomId).emit("online_users_updated", getUsersInRoom(roomId));
//     });
//     // --- LEAVE ROOM ---
//     socket.on("leave_room", (roomId: string) => {
//       console.log("user left:", roomId);
//       // leave Socket.IO room
//       socket.leave(roomId);
//       // cleanup our map
//       const set = connections.get(roomId);
//       if (set) {
//         set.delete(socket.id);
//         if (set.size === 0) connections.delete(roomId);
//       }
//       removeUser(socket.id); // keep your app-level list consistent
//       io.in(roomId).emit("user_left", { userId: socket.id });
//       io.in(roomId).emit("online_users_updated", getUsersInRoom(roomId));
//       delete timeOnline[socket.id];
//     });
//     // --- SIGNALING EVENTS ---
//     // tutor sends offer
//     socket.on("offer", ({ to, sdp }: { to: string; sdp: any }) => {
//       //@todo check only tutor can create offer
//       socket.to(to).emit("offer", { sdp, from: socket.id });
//     });
//     // student sends answer
//     socket.on("answer", ({ to, sdp }: { to: string; sdp: any }) => {
//       socket.to(to).emit("answer", { sdp, from: socket.id });
//     });
//     // ICE exchange
//     socket.on(
//       "ice-candidate",
//       ({ to, candidate }: { to: string; candidate: any }) => {
//         socket.to(to).emit("ice-candidate", { candidate, from: socket.id });
//       }
//     );
//     // --- MESSAGING ---
//     socket.on("send_message", (data: { message: string; roomId: string }) => {
//       const sender = getUserById(socket.data.userId);
//       if (!sender) {
//         console.warn("Sender not found or offline");
//         return;
//       }
//       const payload: IMessage = {
//         userId: sender.userId,
//         userName: sender.userName || "Anonymous",
//         message: data.message,
//         roomId: data.roomId,
//         timestamp: new Date().toISOString(),
//       };
//       console.log("rec msg", payload);
//       io.in(data.roomId).emit("receive_message", payload);
//     });
//     // --- DISCONNECT (global socket disconnect) ---
//     socket.on("disconnect", (reason) => {
//       console.log(`Socket disconnected: ${socket.id} (${reason})`);
//       // compute time online if present
//       if (timeOnline[socket.id]) {
//         const durationMs = Date.now() - timeOnline[socket.id].getTime();
//         console.log(`Socket ${socket.id} was online for ${durationMs} ms`);
//         delete timeOnline[socket.id];
//       }
//       // remove from all room sets and notify each room
//       for (const [roomId, set] of connections.entries()) {
//         if (set.has(socket.id)) {
//           set.delete(socket.id);
//           io.in(roomId).emit("user_left", { userId: socket.id });
//           io.in(roomId).emit("online_users_updated", getUsersInRoom(roomId));
//           if (set.size === 0) connections.delete(roomId);
//         }
//       }
//       removeUser(socket.id); // remove from app-level online list
//     });
//     // ! @todo lecture update
//     socket.on("lecture_update", (data: any) => {
//       const sender = getUserById(socket.data.userId);
//       if (!sender) {
//         console.warn("Sender not found or offline");
//         return;
//       }
//       io.in(data.roomId).emit("receive_message");
//     });
//     socket.on("connect_error", (err: any) => {
//       console.error("Socket connection error:", err.message);
//     });
//     socket.on("reconnect_attempt", (attempt: number) => {
//       console.log(`Reconnection attempt ${attempt}...`);
//     });
//     socket.on("reconnect", (attempt: number) => {
//       console.log(`Reconnected after ${attempt} attempts`);
//     });
//   });
//   return io;
// };
