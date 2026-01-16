import { Socket } from "socket.io";
import { peerManager } from "../../managers/PeerManager";
import { roomManager } from "../../managers/RoomManager";
import { clearLectureStore } from "../../store/liveStore";
import Lecture from "../../models/lecture.model";

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

  const isHost = peer === room.getHost();

  // HOST LEAVES → END ROOM
  if (isHost) {
    console.log("[leave] host left, closing room:", room.roomId);
    await Lecture.findByIdAndUpdate(peer.roomId, {
      status: "completed",
    });

    // remove all peers from peerManager
    for (const p of room.getAllPeers()) {
      peerManager.remove(p.socketId);
    }

    //! clear Inmemory data of chats, poll and qna
    room.close(); // kick everyone, close router
    roomManager.delete(room.roomId); // remove room reference
    clearLectureStore(peer.roomId);
    delete socket.data.activeRoomId;

    socket.to(peer.roomId).emit("host:leave");

    // leave socket room
    socket.leave(peer.roomId);

    return; // IMPORTANT: stop here
  }

  // leave socket room
  delete socket.data.activeRoomId;
  socket.leave(peer.roomId);

  // STUDENT LEAVES → CLEAN ONLY HIM
  console.log("[leave] peer left:", peer.socketId);

  // 1. consumers
  for (const consumer of peer.consumers.values()) {
    try {
      consumer.removeAllListeners();
      consumer.close();
    } catch {}
  }
  peer.consumers.clear();

  // 2. producers (students usually don’t have, but be safe)
  for (const key of Object.keys(peer.producers) as Array<
    keyof typeof peer.producers
  >) {
    const producer = peer.producers[key];
    if (!producer) continue;

    try {
      producer.removeAllListeners();
      producer.close();
    } catch {}
    peer.producers[key] = null;
  }

  // 3. transports
  if (peer.upTransport) {
    try {
      peer.upTransport.removeAllListeners();
      peer.upTransport.close();
    } catch {}
    peer.upTransport = null;
  }

  if (peer.downTransport) {
    try {
      peer.downTransport.removeAllListeners();
      peer.downTransport.close();
    } catch {}
    peer.downTransport = null;
  }

  // 4. remove peer only
  room.removePeer(socket.id);
  peerManager.remove(socket.id);
};
