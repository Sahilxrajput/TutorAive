import { Socket } from "socket.io";
import { peerManager } from "../../managers/PeerManager";
import { roomManager } from "../../managers/RoomManager";

export const handleLeaveLiveSession = (socket: Socket) => async () => {
  const peer = peerManager.get(socket.id);
  if (!peer || !peer.roomId) {
    console.log("peer / roomId not exist");
    return;
  }

  const room = roomManager.get(peer.roomId);
  if (!room) {
    console.log("room not exist");
    return;
  }

  console.log("before cleanup consumers:", peer.consumers.size);

  // 1. Close consumers first
  for (const consumer of [...peer.consumers.values()]) {
    try {
      consumer.removeAllListeners();
      consumer.close(); // IMPORTANT
    } catch (err) {
      console.error("error closing consumer", consumer.id, err);
    }
  }

  peer.consumers.clear();

  console.log("after cleanup consumers:", peer.consumers.size);

  // 2. Close producers explicitly
  for (const key of Object.keys(peer.producers) as Array<
    keyof typeof peer.producers
  >) {
    const producer = peer.producers[key];
    if (!producer) continue;

    try {
      producer.removeAllListeners();
      producer.close();
      peer.producers[key] = null;
    } catch {}
  }

  // 3. Close transports last
  if (peer.downTransport) {
    try {
      peer.downTransport.removeAllListeners();
      peer.downTransport.close();
      peer.downTransport = null;
    } catch {
      peer.downTransport = null;
    }
  }
  if (peer.upTransport) {
    try {
      peer.upTransport.removeAllListeners();
      peer.upTransport.close();
      peer.upTransport = null;
    } catch {
      peer.upTransport = null;
    }
  }

  // 4. Remove from room & peer manager
  room.removePeer(socket.id);
  peerManager.remove(socket.id);
};
