import { Socket } from "socket.io";
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
  (socket: Socket) =>
  async ({ roomId, name, userId }: Payload, cb: any) => {
    const lecture = await Lecture.findById(roomId).select("status");

    if (!lecture) {
      return cb({ allowed: false, error: "Lecture not found" });
    }

    if (lecture.status !== "live") {
      return cb({ allowed: false, error: "Lecture not started yet" });
    }

    const room = roomManager.get(roomId);
    if (!room) {
      return cb({ allowed: false, error: "Live room not available" });
    }

    if (room.hasPeer(userId)) {
      return cb({ error: "User already joined" });
    }

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

    socket.to(roomId).emit("peer-joined", {
      socketId: socket.id,
      name,
      userId,
    });

    cb({
      rtpCapabilities: room.router.rtpCapabilities,
      allowed: true,
    });
  };
