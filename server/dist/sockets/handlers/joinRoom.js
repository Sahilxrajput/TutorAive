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
exports.onJoinRoom = onJoinRoom;
const peer_1 = __importDefault(require("../../classes/peer"));
const utils_1 = require("../utils");
const RoomManager_1 = require("../../managers/RoomManager");
const PeerManager_1 = require("../../managers/PeerManager");
function onJoinRoom(socket, data, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        const { roomId, name, userId, isTeacher } = data;
        let room = RoomManager_1.roomManager.get(roomId);
        // 1. Room does not exist
        if (!room) {
            if (!isTeacher) {
                return cb({ error: "Room does not exist" });
            }
            const router = yield (0, utils_1.createRouter)();
            const peer = new peer_1.default(name, socket.id, userId);
            room = RoomManager_1.roomManager.createRoom(roomId, router, peer);
            PeerManager_1.peerManager.add(peer);
            socket.join(roomId);
            return cb({
                rtpCapabilities: room.router.rtpCapabilities,
                isTeacher: true,
            });
        }
        // 2. Room exists → check duplicate peer
        if (room.hasPeer(userId)) {
            return cb({ error: "User already joined this class" });
        }
        // 3. Create peer only AFTER checks
        const peer = new peer_1.default(name, socket.id, userId);
        room.addPeer(peer);
        PeerManager_1.peerManager.add(peer);
        socket.join(roomId);
        socket.to(roomId).emit("peer-joined", {
            socketId: socket.id,
            name,
            userId,
        });
        cb({
            rtpCapabilities: room.router.rtpCapabilities,
            // producers:
        });
    });
}
