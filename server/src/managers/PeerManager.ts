import Peer from "../classes/peer";

export const peers = new Map<string, Peer>();
export const peerRoom = new Map<string, string>(); // socketId -> roomId

export function addPeer(peer: Peer, roomId: string) {
  peers.set(peer.socketId, peer);
  peerRoom.set(peer.socketId, roomId);
}

export function removePeer(socketId: string) {
  peers.delete(socketId);
  peerRoom.delete(socketId);
}

export function getPeer(socketId: string) {
  return peers.get(socketId);
}

export function getPeerRoom(socketId: string) {
  return peerRoom.get(socketId);
}

export function hasPeer(socketId: string): boolean {
  return peers.has(socketId);
}

// export function setProducer(
//   socketId: string,
//   type: "cam" | "mic" | "screen" | "saudio",
//   producer
// ) {
//   const peer = peers.get(socketId);
//   if (!peer) return;

//   peer.producer[type] = producer;
// }

// export function getProducer(
//   socketId: string,
//   type: "cam" | "mic" | "screen" | "saudio"
// ) {
//   return peers.get(socketId)?.producer[type];
// }


// export function removeProducer(
//   socketId: string,
//   type: "cam" | "mic" | "screen" | "saudio"
// ) {
//   const peer = peers.get(socketId);
//   if (!peer) return;

//   peer.producer[type] = null;
// }

// export function addConsumer(socketId: string, consumer) {
//   const peer = peers.get(socketId);
//   if (!peer) return;

//   peer.consumers.push(consumer);
// }

// export function removeConsumer(socketId: string, consumerId: string) {
//   const peer = peers.get(socketId);
//   if (!peer) return;

//   peer.consumers = peer.consumers.filter((c) => c.id !== consumerId);
// }

// export function getConsumers(socketId: string) {
//   return peers.get(socketId)?.consumers || [];
// }
