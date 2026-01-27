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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveInstructorLiveSession = void 0;
const PeerManager_1 = require("../../managers/PeerManager");
const RoomManager_1 = require("../../managers/RoomManager");
const liveStore_1 = require("../../store/liveStore");
const lecture_model_1 = __importDefault(require("../../models/lecture.model"));
const leaveInstructorLiveSession = (socket) => () => __awaiter(void 0, void 0, void 0, function* () {
    const peer = PeerManager_1.peerManager.get(socket.id);
    if (!peer || !peer.roomId)
        return;
    const roomId = peer.roomId;
    const room = RoomManager_1.roomManager.get(roomId);
    if (!room)
        return;
    console.log("[leave] host left, tearing down room:", roomId);
    // 1. Notify students FIRST
    socket.to(roomId).emit("live-session:closed");
    // 2. Force all sockets to leave socket.io room
    const sockets = yield socket.nsp.in(roomId).fetchSockets();
    let i = 0;
    for (const s of sockets) {
        console.log(i++);
        s.leave(roomId);
        delete s.data.activeRoomId;
    }
    // 3. Remove all peers from peerManager
    for (const p of room.getAllPeers()) {
        PeerManager_1.peerManager.remove(p.socketId);
    }
    // 4. Close mediasoup router + clean room internals
    room.close();
    // 5. Remove room references
    RoomManager_1.roomManager.delete(roomId);
    // 6. Clear in-memory stores (chat, poll, qna)
    (0, liveStore_1.clearLectureStore)(roomId);
    // 7. Update DB state
    const lecture = yield lecture_model_1.default.findByIdAndUpdate(roomId, {
        status: "completed",
        endTime: Date.now()
    });
    console.log("Lecture:", lecture);
});
exports.leaveInstructorLiveSession = leaveInstructorLiveSession;
