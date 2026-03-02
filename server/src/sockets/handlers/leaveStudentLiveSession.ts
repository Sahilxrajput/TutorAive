import Lecture from "../../models/lecture.model";
import { Namespace, Socket } from "socket.io";
import { peerManager } from "../../managers/PeerManager";
import { roomManager } from "../../managers/RoomManager";
import Attendance from "../../models/attendence.model";

export const leaveStudentLiveSession =
  (classroom: Namespace, socket: Socket) => async () => {
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

    setTimeout(() => {
      const room = classroom.adapter.rooms.get(roomId);
      const count = room ? room.size : 0;

      classroom.to(roomId).emit("peer:count", { count });
    }, 0);

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
    const attendance = await Attendance.findOne({
      lecture: roomId,
      student: studentId,
    });

    if (!attendance || !attendance.joinedAt) {
      console.log("No attendance record found for duration calculation");
      return;
    }

    const now = new Date();
    const sessionDuration = now.getTime() - attendance.joinedAt.getTime();

    const totalDuration = (attendance.totalDuration || 0) + sessionDuration;

    const lecture = await Lecture.findById(roomId);
    if (!lecture) return;

    const lectureStartTime = new Date(lecture.startTime);

    // Calculate lateness based on JOIN time, not leave time
    const joinedLate =
      attendance.joinedAt.getTime() - lectureStartTime.getTime() >
      10 * 60 * 1000; // 10 min

    const MIN_REQUIRED_DURATION = 5 * 60 * 1000; // 5 minutes

    let status: "present" | "late" | "absent" = "absent";

    if (totalDuration >= MIN_REQUIRED_DURATION) {
      status = joinedLate ? "late" : "present";
    }

    await Attendance.updateOne(
      { lecture: roomId, student: studentId },
      {
        $set: {
          leftAt: now,
          totalDuration,
          status,
        },
      },
    );

    console.log(
      `[attendance] ${studentId} marked ${status} (duration: ${Math.floor(
        totalDuration / 60000,
      )} min)`,
    );
  };
