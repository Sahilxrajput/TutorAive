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
const attendence_model_1 = __importDefault(require("../../models/attendence.model"));
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
    const attendance = yield attendence_model_1.default.findOne({
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
    const lecture = yield lecture_model_1.default.findById(roomId);
    if (!lecture)
        return;
    const lectureStartTime = new Date(lecture.startTime);
    // Calculate lateness based on JOIN time, not leave time
    const joinedLate = attendance.joinedAt.getTime() - lectureStartTime.getTime() > 10 * 60 * 1000; // 10 min
    const MIN_REQUIRED_DURATION = 5 * 60 * 1000; // 5 minutes
    let status = "absent";
    if (totalDuration >= MIN_REQUIRED_DURATION) {
        status = joinedLate ? "late" : "present";
    }
    yield attendence_model_1.default.updateOne({ lecture: roomId, student: studentId }, {
        $set: {
            leftAt: now,
            totalDuration,
            status,
        },
    });
    console.log(`[attendance] ${studentId} marked ${status} (duration: ${Math.floor(totalDuration / 60000)} min)`);
});
exports.leaveStudentLiveSession = leaveStudentLiveSession;
;
