import { AppData, Consumer, Producer } from "mediasoup/node/lib/types";
import Peer from "../classes/peer";
import { rooms } from "./RoomManager";
import Room from "../classes/room";

export const peerRoom = new Map<string, string>(); // socketId -> roomId

export function getRoomBySocket(socketId: string): Room | undefined {
  const roomId = peerRoom.get(socketId);
  if (!roomId) return;
  return rooms.get(roomId);
}

export function getPeerBySocket(socketId: string): Peer | undefined {
  const room = getRoomBySocket(socketId);
  return room?.getPeer(socketId);
}

/* -------------------- PEER LIFECYCLE -------------------- */

export function addPeer(peer: Peer, roomId: string): void {
  const room = rooms.get(roomId);
  if (!room) throw new Error("Room not found");

  room.addPeer(peer);
  peerRoom.set(peer.socketId, roomId);
}

export function removePeer(socketId: string): void {
  const room = getRoomBySocket(socketId);
  room?.removePeer(socketId);

  peerRoom.delete(socketId);

  // optional cleanup
  if (room && room.isEmpty()) {
    rooms.delete(room.roomId);
  }
}

/* -------------------- PRODUCERS -------------------- */

export function setProducer(
  socketId: string,
  type: "cam" | "mic" | "screen" | "saudio",
  producer: Producer<AppData> | null
): void {
  const peer = getPeerBySocket(socketId);
  if (!peer) return;

  peer.producer[type] = producer;
}

export function getProducer(
  socketId: string,
  type: "cam" | "mic" | "screen" | "saudio"
) {
  return getPeerBySocket(socketId)?.producer[type];
}

export function removeProducer(
  socketId: string,
  type: "cam" | "mic" | "screen" | "saudio"
): void {
  const peer = getPeerBySocket(socketId);
  if (!peer) return;

  peer.producer[type] = null;
}

/* -------------------- CONSUMERS -------------------- */

export function addConsumer(socketId: string, consumer: Consumer): void {
  const peer = getPeerBySocket(socketId);
  if (!peer) return;

  peer.consumers.push(consumer);
}

export function removeConsumer(socketId: string, consumerId: string): void {
  const peer = getPeerBySocket(socketId);
  if (!peer) return;

  peer.consumers = peer.consumers.filter(
    (consumer) => consumer.id !== consumerId
  );
}

export function getConsumers(socketId: string): Consumer[] {
  return getPeerBySocket(socketId)?.consumers || [];
}
