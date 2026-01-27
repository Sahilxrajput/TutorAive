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
exports.handleCreateWebRtcTransport = void 0;
const RoomManager_1 = require("../../managers/RoomManager");
const transport_1 = require("../../mediasoup/transport");
const handleCreateWebRtcTransport = (socket) => (_a, cb_1) => __awaiter(void 0, [_a, cb_1], void 0, function* ({ isSender, roomId }, cb) {
    console.log(`Is this a sender request? ${isSender}`);
    const room = RoomManager_1.roomManager.get(roomId);
    if (!room)
        return cb({ error: "room not found" });
    const peer = room.getPeer(socket.id);
    if (!peer)
        return cb({ error: "peer not found" });
    if (!room.router)
        return cb({ error: "room router not found" });
    const transport = yield (0, transport_1.createWebRtcTransport)(room.router);
    if (!transport)
        return cb({ error: "error while creating transport" });
    console.log("transport created successfully");
    if (isSender) {
        peer.upTransport = transport;
    }
    else {
        peer.downTransport = transport;
    }
    cb({
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
    });
});
exports.handleCreateWebRtcTransport = handleCreateWebRtcTransport;
