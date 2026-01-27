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
exports.handleInstructorJoinLiveSession = void 0;
const peer_1 = __importDefault(require("../../classes/peer"));
const RoomManager_1 = require("../../managers/RoomManager");
const PeerManager_1 = require("../../managers/PeerManager");
const router_1 = require("../../mediasoup/router");
const lecture_model_1 = __importDefault(require("../../models/lecture.model"));
const queue_1 = require("../../redis/queue");
const handleInstructorJoinLiveSession = (socket) => (_a, cb_1) => __awaiter(void 0, [_a, cb_1], void 0, function* ({ roomId, name, userId }, cb) {
    // 1. Fetch lecture FIRST (no update yet)
    const lecture = yield lecture_model_1.default.findById(roomId).select("createdBy status classroom title");
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
    yield lecture.save();
    (0, queue_1.addClassNotificationJob)(lecture);
    socket.data.activeRoomId = roomId;
    socket.join(roomId);
    let room = RoomManager_1.roomManager.get(roomId);
    // 5. Create room only if it doesn't exist
    if (!room) {
        const router = yield (0, router_1.createRouter)();
        const peer = new peer_1.default({
            name,
            socketId: socket.id,
            userId,
            roomId,
        });
        room = RoomManager_1.roomManager.createRoom(roomId, router, peer);
        PeerManager_1.peerManager.add(peer);
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
});
exports.handleInstructorJoinLiveSession = handleInstructorJoinLiveSession;
