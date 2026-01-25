import { Socket } from "socket.io";
import Peer from "../../classes/peer";
import { roomManager } from "../../managers/RoomManager";
import { peerManager } from "../../managers/PeerManager";
import { createRouter } from "../../mediasoup/router";
import Lecture from "../../models/lecture.model";
import { addClassNotificationJob } from "../../redis/queue";

interface Payload {
  roomId: string;
  name: string;
  userId: string;
}

export const handleInstructorJoinLiveSession =
  (socket: Socket) =>
  async ({ roomId, name, userId }: Payload, cb: any) => {
    // 1. Fetch lecture FIRST (no update yet)
    const lecture = await Lecture.findById(roomId).select(
      "createdBy status classroom title",
    );

    if (!lecture) {
      return cb({ error: "Lecture not found" });
    }

    // 2. Auth check
    if (lecture.createdBy.toString() !== socket.data.userId) {
      return cb({ error: "You are not authorized" });
    }

    // @todo
    // 3. Status guards
    // if (lecture.status === "live") {
    //   console.log("[join] lecture already live");
    //   return cb({ error: "lecture already live" });
    // }

    if (lecture.status === "cancelled" || lecture.status === "completed") {
      return cb({ error: `Lecture is ${lecture.status}` });
    }

    // 4. NOW update status to live
    lecture.status = "live";
    await lecture.save();
    addClassNotificationJob(lecture);

    socket.data.activeRoomId = roomId;
    socket.join(roomId);

    let room = roomManager.get(roomId);

    // 5. Create room only if it doesn't exist
    if (!room) {
      const router = await createRouter();

      const peer = new Peer({
        name,
        socketId: socket.id,
        userId,
        roomId,
      });

      room = roomManager.createRoom(roomId, router, peer);
      peerManager.add(peer);
      console.log("room create");

      socket.to(roomId).emit("live-session:started", {
        socketId: socket.id,
        name,
        userId,
      });
    }

    return cb({
      rtpCapabilities: room.router.rtpCapabilities,
    });
  };
