import { Socket } from "socket.io";
import { roomManager } from "../../managers/RoomManager";
import { peerManager } from "../../managers/PeerManager";

interface TransportProducePayload {
  roomId: string;
  kind: "audio" | "video";
  transportId: string;
  rtpParameters: any;
  appData: any;
}

export const handleTransportProduce =
  (socket: Socket) =>
  async (
    {
      roomId,
      kind,
      transportId,
      rtpParameters,
      appData,
    }: TransportProducePayload,
    cb: Function
  ) => {
    try {
      console.log("request to create producer");

      const room = roomManager.get(roomId);
      if (!room) return cb({ error: "room not found" });

      const transport = room.getTransportById(transportId);
      if (!transport) return cb({ error: "transport not found" });

      const producer = await transport.produce({
        kind,
        rtpParameters,
        appData,
      });

      const peer = peerManager.get(socket.id);
      if (!peer) return cb({ error: "peer not found" });

      switch (appData.mediaTag) {
        case "cam-video":
          peer.producers.cam = producer;
          break;

        case "mic-audio":
          peer.producers.mic = producer;
          break;

        case "screen-video":
          peer.producers.screen = producer;
          break;

        case "screen-audio":
          peer.producers.saudio = producer;
          break;

        default:
          console.warn("unknown mediaTag:", appData.mediaTag);
      }

      producer.on("transportclose", () => {
        console.log("transport for this producer closed");
        producer.close();
      });

      cb({ id: producer.id });
    } catch (error) {
      console.error(error);
      cb({ error: "failed to create producer" });
    }
  };
