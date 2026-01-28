import Lecture from "../../models/lecture.model";
import { Socket } from "socket.io";
import { peerManager } from "../../managers/PeerManager";
import { roomManager } from "../../managers/RoomManager";
import Attendance from "../../models/attendence.model.";

export const leaveStudentLiveSession = (socket: Socket) => async () => {
  const peer = peerManager.get(socket.id);
  if (!peer || !peer.roomId) {
    console.log("peer / roomId not exist");
    return;
  }

  const roomId = peer.roomId;
  const studentId = peer.userId; // IMPORTANT

  const room = roomManager.get(roomId);
  if (!room) {
    console.log("room not exist");
    return;
  }

  console.log("[leave] student left:", peer.socketId);

  delete socket.data.activeRoomId;
  socket.leave(roomId);

  // 1. consumers
  for (const consumer of peer.consumers.values()) {
    try {
      consumer.removeAllListeners();
      consumer.close();
    } catch {}
  }
  peer.consumers.clear();

  // 2. producers
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

  // 4. remove peer
  room.removePeer(socket.id);
  peerManager.remove(socket.id);

  // ---- ATTENDANCE LOGIC STARTS HERE ----
  const lecture = await Lecture.findById(roomId);
  if (!lecture) return;

  const lectureStartTime = new Date(lecture.startTime);
  const now = new Date();

  const diffMinutes = (now.getTime() - lectureStartTime.getTime()) / 60000;

  const status = diffMinutes > 10 ? "late" : "present";

  await Attendance.findOneAndUpdate(
    { lecture: roomId, student: studentId },
    {
      status,
      markedAt: now,
    },
    { upsert: true },
  );

  console.log(
    `[attendance] ${studentId} marked ${status} for lecture ${roomId}`,
  );
};
