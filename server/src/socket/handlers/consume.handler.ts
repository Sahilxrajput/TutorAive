import { Socket } from "socket.io";
import { roomManager } from "../../managers/RoomManager";

interface ConsumePayload {
  rtpCapabilities: any;
  roomId: string;
  producerId: string;
}

export const handleConsume =
  (socket: Socket) =>
  async (
    { rtpCapabilities, roomId, producerId }: ConsumePayload,
    cb: Function
  ) => {
    try {
      const room = roomManager.get(roomId);
      if (!room) {
        console.log("[consume] room not found:", roomId);
        return cb({ error: "room not found" });
      }

      const peer = room.getPeer(socket.id);
      if (!peer) {
        console.log("[consume] peer not found:", socket.id);
        return cb({ error: "peer not found" });
      }

      const transport = peer.downTransport;
      if (!transport) {
        console.log("[consume] recv transport missing:", socket.id);
        return cb({ error: "no recv transport" });
      }

      if (!room.router) {
        console.log("[consume] router not found");
        return cb({ error: "router not found" });
      }

      const canConsume = room.router.canConsume({
        producerId,
        rtpCapabilities,
      });

      if (!canConsume) {
        console.log("[consume] cannot consume producer:", producerId);
        return cb({ error: "cannot consume" });
      }

      console.log("[consume] can consume producer:", producerId);

      const consumer = await transport.consume({
        producerId,
        rtpCapabilities,
        paused: true,
      });

      peer.addConsumer(consumer);
      console.log("[consume]add in peer:");

      consumer.on("transportclose", () => {
        console.log("[consume] transport closed for consumer:", consumer.id);
      });

      consumer.on("producerclose", () => {
        console.log("[consume] producer closed for consumer:", consumer.id);
        peer.removeConsumer(consumer.id);
      });

      cb({
        id: consumer.id,
        producerId,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
      });
    } catch (error) {
      console.error("[consume] error:", error);
      cb({ error: "consume failed" });
    }
  };
