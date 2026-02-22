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
exports.handleStudentJoinLiveSession = void 0;
const attendence_model_1 = __importDefault(require("../../models/attendence.model"));
const peer_1 = __importDefault(require("../../classes/peer"));
const PeerManager_1 = require("../../managers/PeerManager");
const RoomManager_1 = require("../../managers/RoomManager");
const lecture_model_1 = __importDefault(require("../../models/lecture.model"));
const handleStudentJoinLiveSession = (socket) => (_a, cb_1) => __awaiter(void 0, [_a, cb_1], void 0, function* ({ roomId, name, userId }, cb) {
    try {
        console.log("roomId:", roomId);
        if (!roomId || !userId) {
            return cb({ error: "Invalid data" });
        }
        const lecture = yield lecture_model_1.default.findById(roomId).select("status");
        if (!lecture)
            return cb({ error: "Lecture not found" });
        if (lecture.status !== "live")
            return cb({ error: "Lecture not live" });
        const room = RoomManager_1.roomManager.get(roomId);
        if (!room)
            return cb({ error: "Room unavailable" });
        if (room.hasPeer(userId)) {
            return cb({ error: "Already joined" });
        }
        //@todo Enrollment check here
        yield attendence_model_1.default.findOneAndUpdate({ lecture: roomId, student: userId }, {
            $setOnInsert: {
                lecture: roomId,
                student: userId,
            },
            $set: {
                joinedAt: new Date(),
            },
        }, { upsert: true, new: true });
        const peer = new peer_1.default({
            name,
            socketId: socket.id,
            userId,
            roomId,
        });
        room.addPeer(peer);
        PeerManager_1.peerManager.add(peer);
        socket.data.activeRoomId = roomId;
        socket.join(roomId);
        socket.to(roomId).emit("peer-joined", {
            socketId: socket.id,
            name,
            userId,
        });
        return cb({ rtpCapabilities: room.router.rtpCapabilities });
    }
    catch (err) {
        console.error(err);
        return cb({ error: "Internal server error" });
    }
});
exports.handleStudentJoinLiveSession = handleStudentJoinLiveSession;
