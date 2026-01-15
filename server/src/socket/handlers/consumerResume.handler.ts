import { Socket } from "socket.io";
import { roomManager } from "../../managers/RoomManager";

interface ConsumerResumePayload {
  roomId: string;
  consumerId: string;
}

export const handleConsumerResume =
  (socket: Socket) =>
  async ({ roomId, consumerId }: ConsumerResumePayload) => {
    console.log("resume enter");
    const room = roomManager.get(roomId);
    if (!room) {
      console.log("[consumer-resume] room not found:", roomId);
      return;
    }

    const peer = room.getPeer(socket.id);
    if (!peer) {
      console.log("[consumer-resume] peer not found:", socket.id);
      return;
    }

    const consumer = peer.consumers.get(consumerId);
    if (!consumer) {
      console.log("[consumer-resume] consumer not found:", consumerId);
      return;
    }

    console.log("[consumer-resume] resuming consumer:", consumerId);
    await consumer.resume();
  };
