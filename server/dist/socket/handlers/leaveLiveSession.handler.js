"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLeaveLiveSession = void 0;
const PeerManager_1 = require("../../managers/PeerManager");
const RoomManager_1 = require("../../managers/RoomManager");
const handleLeaveLiveSession = (socket) => () => __awaiter(void 0, void 0, void 0, function* () {
    const peer = PeerManager_1.peerManager.get(socket.id);
    if (!peer || !peer.roomId) {
        console.log("peer / roomId not exist");
        return;
    }
    const room = RoomManager_1.roomManager.get(peer.roomId);
    if (!room) {
        console.log("room not exist");
        return;
    }
    const isHost = peer === room.getHost();
    // HOST LEAVES → END ROOM
    if (isHost) {
        console.log("[leave] host left, closing room:", room.roomId);
        room.close(); // kick everyone, close router
        RoomManager_1.roomManager.delete(room.roomId); // remove room reference
        // remove all peers from peerManager
        for (const p of room.getAllPeers()) {
            PeerManager_1.peerManager.remove(p.socketId);
        }
        return; // IMPORTANT: stop here
    }
    // STUDENT LEAVES → CLEAN ONLY HIM
    console.log("[leave] peer left:", peer.socketId);
    // 1. consumers
    for (const consumer of peer.consumers.values()) {
        try {
            consumer.removeAllListeners();
            consumer.close();
        }
        catch (_a) { }
    }
    peer.consumers.clear();
    // 2. producers (students usually don’t have, but be safe)
    for (const key of Object.keys(peer.producers)) {
        const producer = peer.producers[key];
        if (!producer)
            continue;
        try {
            producer.removeAllListeners();
            producer.close();
        }
        catch (_b) { }
        peer.producers[key] = null;
    }
    // 3. transports
    if (peer.upTransport) {
        try {
            peer.upTransport.removeAllListeners();
            peer.upTransport.close();
        }
        catch (_c) { }
        peer.upTransport = null;
    }
    if (peer.downTransport) {
        try {
            peer.downTransport.removeAllListeners();
            peer.downTransport.close();
        }
        catch (_d) { }
        peer.downTransport = null;
    }
    // 4. remove peer only
    room.removePeer(socket.id);
    PeerManager_1.peerManager.remove(socket.id);
});
exports.handleLeaveLiveSession = handleLeaveLiveSession;
