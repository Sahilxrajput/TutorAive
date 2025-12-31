import { Router } from "mediasoup/node/lib/RouterTypes";
import Room from "../classes/room";
import Peer from "../classes/peer";
import { addPeer, removePeer, peerRoom } from "./PeerManager";

export const rooms = new Map<string, Room>(); // roomId -> Room

/* -------------------- ROOM LIFECYCLE -------------------- */

export function createRoom(roomId: string, router: Router, host: Peer): Room {
  if (rooms.has(roomId)) {
    throw new Error("Room already exists");
  }

  const room = new Room(roomId, router, host);
  rooms.set(roomId, room);

  // PeerManager handles peer-room mapping
  addPeer(host, roomId);

  return room;
}

export function removeRoom(roomId: string): void {
  rooms.delete(roomId);
}

export function getRoom(roomId: string): Room | undefined {
  return rooms.get(roomId);
}

/* -------------------- ROOM MEMBERSHIP -------------------- */

// export function joinRoom(roomId: string, peer: Peer): void {
//   const room = rooms.get(roomId);
//   if (!room) {
//     throw new Error("Room not found");
//   }

//   addPeer(peer, roomId);
// }

export function leaveRoom(socketId: string): void {
  const roomId = peerRoom.get(socketId);
  if (!roomId) return;

  const room = rooms.get(roomId);

  // Delegate cleanup to PeerManager
  removePeer(socketId);

  //@todo : if host leaves, destroy room or transfer ownership

  if (room && room.isEmpty()) {
    rooms.delete(roomId);
  }
}
