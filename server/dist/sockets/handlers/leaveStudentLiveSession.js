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
exports.leaveStudentLiveSession = void 0;
const lecture_model_1 = __importDefault(require("../../models/lecture.model"));
const PeerManager_1 = require("../../managers/PeerManager");
const RoomManager_1 = require("../../managers/RoomManager");
const attendence_model_1 = __importDefault(require("../../models/attendence.model."));
const leaveStudentLiveSession = (socket) => () => __awaiter(void 0, void 0, void 0, function* () {
    const peer = PeerManager_1.peerManager.get(socket.id);
    if (!peer || !peer.roomId) {
        console.log("peer / roomId not exist");
        return;
    }
    const roomId = peer.roomId;
    const studentId = peer.userId; // IMPORTANT
    const room = RoomManager_1.roomManager.get(roomId);
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
        }
        catch (_a) { }
    }
    peer.consumers.clear();
    // 2. producers
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
    // 4. remove peer
    room.removePeer(socket.id);
    PeerManager_1.peerManager.remove(socket.id);
    // ---- ATTENDANCE LOGIC STARTS HERE ----
    const lecture = yield lecture_model_1.default.findById(roomId);
    if (!lecture)
        return;
    const lectureStartTime = new Date(lecture.startTime);
    const now = new Date();
    const diffMinutes = (now.getTime() - lectureStartTime.getTime()) / 60000;
    const status = diffMinutes > 10 ? "late" : "present";
    yield attendence_model_1.default.findOneAndUpdate({ lecture: roomId, student: studentId }, {
        status,
        markedAt: now,
    }, { upsert: true });
    console.log(`[attendance] ${studentId} marked ${status} for lecture ${roomId}`);
});
exports.leaveStudentLiveSession = leaveStudentLiveSession;
