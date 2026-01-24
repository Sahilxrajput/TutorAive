import { Socket } from "socket.io";
import { peerManager } from "../../managers/PeerManager";
import { roomManager } from "../../managers/RoomManager";
import { clearLectureStore } from "../../store/liveStore";
import Lecture from "../../models/lecture.model";

export const leaveInstructorLiveSession = (socket: Socket) => async () => {
  const peer = peerManager.get(socket.id);
  if (!peer || !peer.roomId) return;

  const roomId = peer.roomId;
  const room = roomManager.get(roomId);
  if (!room) return;

  console.log("[leave] host left, tearing down room:", roomId);

  // 1. Notify students FIRST
  socket.to(roomId).emit("live-session:closed");

  // 2. Force all sockets to leave socket.io room
  const sockets = await socket.nsp.in(roomId).fetchSockets();
  let i =0
  for (const s of sockets) {
    console.log(i++)
    s.leave(roomId);
    delete s.data.activeRoomId;
  }

  // 3. Remove all peers from peerManager
  for (const p of room.getAllPeers()) {
    peerManager.remove(p.socketId);
  }

  // 4. Close mediasoup router + clean room internals
  room.close();

  // 5. Remove room references
  roomManager.delete(roomId);

  // 6. Clear in-memory stores (chat, poll, qna)
  clearLectureStore(roomId);

  // 7. Update DB state
  const lecture  = await Lecture.findByIdAndUpdate(roomId, {
    status: "completed",
    endTime: Date.now()
  });
  console.log("Lecture:", lecture)
};
