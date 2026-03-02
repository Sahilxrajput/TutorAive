import Attendance from "../../models/attendence.model";
import { Namespace, Socket } from "socket.io";
import Peer from "../../classes/peer";
import { peerManager } from "../../managers/PeerManager";
import { roomManager } from "../../managers/RoomManager";
import Lecture from "../../models/lecture.model";

interface Payload {
  roomId: string;
  name: string;
  userId: string;
}

export const handleStudentJoinLiveSession =
  (classroom: Namespace, socket: Socket) =>
  async ({ roomId, name, userId }: Payload, cb: any) => {
    try {
      console.log("roomId:", roomId);
      if (!roomId || !userId) {
        return cb({ error: "Invalid data" });
      }

      const lecture = await Lecture.findById(roomId).select("status");
      if (!lecture) return cb({ error: "Lecture not found" });
      if (lecture.status !== "live") return cb({ error: "Lecture not live" });

      const room = roomManager.get(roomId);
      if (!room) return cb({ error: "Room unavailable" });

      if (room.hasPeer(userId)) {
        return cb({ error: "Already joined" });
      }

      //@todo Enrollment check here

      await Attendance.findOneAndUpdate(
        { lecture: roomId, student: userId },
        {
          $setOnInsert: {
            lecture: roomId,
            student: userId,
          },
          $set: {
            joinedAt: new Date(),
          },
        },
        { upsert: true, new: true },
      );

      const peer = new Peer({
        name,
        socketId: socket.id,
        userId,
        roomId,
      });

      room.addPeer(peer);
      peerManager.add(peer);

      socket.data.activeRoomId = roomId;
      socket.join(roomId);

      socket.to(roomId).emit("new-peer-joined", {
        socketId: socket.id,
        name,
        userId,
      });

      const roomSocket = classroom.adapter.rooms.get(roomId);
      const count = roomSocket ? roomSocket.size : 0;

      classroom.to(roomId).emit("peer:count", { count });

      return cb({ rtpCapabilities: room.router.rtpCapabilities });
    } catch (err) {
      console.error(err);
      return cb({ error: "Internal server error" });
    }
  };
