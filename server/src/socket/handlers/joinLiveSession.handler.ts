import { Socket } from "socket.io";
import Peer from "../../classes/peer";
import { roomManager } from "../../managers/RoomManager";
import { peerManager } from "../../managers/PeerManager";
import { createRouter } from "../../mediasoup/router";

export const handleJoinLiveSession =
  (socket: Socket) => async (data: any, cb: any) => {
    const { roomId, name, userId } = data;

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

      socket.join(roomId);

      return cb({
        rtpCapabilities: room.router.rtpCapabilities,
        isTeacher: true,
      });
    }

    // 2. Room exists → check duplicate peer
    if (room.hasPeer(userId)) {
      console.log("User already joined this class");
      return cb({ error: "User already joined this class" });
    }

    // 3. Create peer only AFTER checks
    const peer = new Peer({
      name,
      socketId: socket.id,
      userId,
      roomId,
    });

    room.addPeer(peer);
    peerManager.add(peer);

    socket.join(roomId);

    socket.to(roomId).emit("peer-joined", {
      socketId: socket.id,
      name,
      userId,
    });

    cb({
      rtpCapabilities: room.router.rtpCapabilities,
    });
  };
