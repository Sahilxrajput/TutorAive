import { Socket } from "socket.io";
import { createRoom, getRoom, rooms } from "../../managers/RoomManager";
import { addPeer, getPeerBySocket } from "../../managers/PeerManager";
import Peer from "../../classes/peer";
import { createRouter } from "../utils";

export async function onJoinRoom(socket: Socket, data: any, cb: any) {
  const { roomId, name, userId } = data;

  // If peer already exists, ignore (duplicate join)
  if (getPeerBySocket(socket.id)) return; // per room a peer

  // Create Peer instance
  const peer = new Peer(name, socket.id, userId);

  let room = getRoom(roomId);

  // Create room if not exists
  if (!room) {
    const router = await createRouter();
    room = createRoom(roomId, router, peer); // @fix only teacher can create room
  } else {
    // Add peer to room class & Global peer map
    addPeer(peer, roomId);
  }

  const producers = room.getProducer();

  // Join socket.io room
  socket.join(roomId);
  socket.emit("joined-room", {
    roomId,
    peers: room.getAllPeers(),
  }); //@remind

  socket.to(roomId).emit("peer-joined", {
    socketId: socket.id,
    name,
    userId,
  });

  cb({
    rtpCapabilities: room.router.rtpCapabilities,
  });
}
