import { Socket } from "socket.io";
import { roomManager } from "../../managers/RoomManager";
import { createWebRtcTransport } from "../../mediasoup/transport";

interface CreateTransportPayload {
  isSender: boolean;
  roomId: string;
  socketId: string;
}

export const handleCreateWebRtcTransport =
  (socket: Socket) =>
  async ({ isSender, roomId }: CreateTransportPayload, cb: Function) => {
    console.log(`Is this a sender request? ${isSender}`);

    const room = roomManager.get(roomId);
    if (!room) return cb({ error: "room not found" });

    const peer = room.getPeer(socket.id);
    if (!peer) return cb({ error: "peer not found" });

    if (!room.router) return cb({ error: "room router not found" });

    const transport = await createWebRtcTransport(room.router);
    if (!transport) return cb({ error: "error while creating transport" });

    if (isSender) {
      peer.upTransport = transport;
    } else {
      peer.downTransport = transport;
    }

    cb({
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    });
  };
