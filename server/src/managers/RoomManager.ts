import { Router } from "mediasoup/node/lib/RouterTypes";
import Room from "../classes/room";
import Peer from "../classes/peer";
import { peerRoom, peers } from "./PeerManager";

export const rooms = new Map<string, Room>();

export function addRoom(room: Room) {
  rooms.set(room.roomId, room);
}

export function getRoom(roomId: string) {
  return rooms.get(roomId);
}

export function removeRoom(roomId: string) {
  rooms.delete(roomId);
}

function createRoom(roomId: string, router: Router, host: Peer) {
  const room = new Room(roomId, router, host);

  rooms.set(roomId, room);
  peers.set(host.socketId, host);
  peerRoom.set(host.socketId, roomId);

  return room;
}

function joinRoom(roomId: string, peer: Peer) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.addPeer(peer);

  peers.set(peer.socketId, peer);
  peerRoom.set(peer.socketId, roomId);
}

function leaveRoom(socketId: string) {
  const roomId = peerRoom.get(socketId);
  if (!roomId) return;

  const room = rooms.get(roomId);
  room?.removePeer(socketId);

  peerRoom.delete(socketId);
  peers.delete(socketId);

  // destroy room if empty
  if (room?.isEmpty()) {
    rooms.delete(roomId);
  }
}

function getPeersInRoom(roomId: string): Peer[] {
  const room = rooms.get(roomId);
  if (!room) return [];

  return [...room.peers.values()];
}

function getPeer(socketId: string): Peer | undefined {
  return peers.get(socketId);
}

