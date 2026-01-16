import { Socket } from "socket.io";
import Peer from "../../classes/peer";
import { roomManager } from "../../managers/RoomManager";
import { peerManager } from "../../managers/PeerManager";
import { createRouter } from "../../mediasoup/router";
import Lecture from "../../models/lecture.model";

interface Payload {
  roomId: string;
  name: string;
  userId: string;
}

export const handleInstructorJoinLiveSession =
  (socket: Socket) =>
  async ({ roomId, name, userId }: Payload, cb: any) => {
    
    const lecture = await Lecture.findByIdAndUpdate(
      roomId,
      { status: "live" },
      { new: true, runValidators: true }
    ).select("status");

    if (!lecture) {
      throw new Error("Lecture not found");
    }

    if (lecture.createdBy.toString() !== socket.data.userId) {
      throw new Error("You are not authorized");
    }

    socket.data.activeRoomId = roomId;
    socket.join(roomId);

    let room = roomManager.get(roomId);
    const isTeacher = socket.data.userRole === "instructor";

    // 1. Room does not exist
    if (!room || isTeacher) {
      const router = await createRouter();

      const peer = new Peer({
        name,
        socketId: socket.id,
        userId,
        roomId,
      });

      room = roomManager.createRoom(roomId, router, peer);
      peerManager.add(peer);

      socket.to(roomId).emit("session-start", {
        socketId: socket.id,
        name,
        userId,
      });

      return cb({
        rtpCapabilities: room.router.rtpCapabilities,
        isTeacher: true,
      });
    }
  };
