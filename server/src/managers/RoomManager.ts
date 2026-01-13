import { Router } from "mediasoup/node/lib/RouterTypes";
import Room from "../classes/room";
import Peer from "../classes/peer";

const rooms = new Map<string, Room>(); // roomId -> Room

export const roomManager = {
  createRoom(roomId: string, router: Router, host: Peer): Room {
    if (rooms.has(roomId)) {
      throw new Error("Room already exists");
    }

    const room = new Room(roomId, router, host);
    rooms.set(roomId, room);

    return room;
  },

  get(roomId: string) {
    return rooms.get(roomId);
  },

  add(room: Room) {
    rooms.set(room.roomId, room);
  },

  delete(roomId: string) {
    rooms.delete(roomId);
  },
};


