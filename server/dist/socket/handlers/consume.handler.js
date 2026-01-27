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
exports.handleConsume = void 0;
const RoomManager_1 = require("../../managers/RoomManager");
const handleConsume = (socket) => (_a, cb_1) => __awaiter(void 0, [_a, cb_1], void 0, function* ({ rtpCapabilities, roomId, producerId }, cb) {
    try {
        const room = RoomManager_1.roomManager.get(roomId);
        if (!room) {
            console.log("[consume] room not found:", roomId);
            return cb({ error: "room not found" });
        }
        const peer = room.getPeer(socket.id);
        if (!peer) {
            console.log("[consume] peer not found:", socket.id);
            return cb({ error: "peer not found" });
        }
        const transport = peer.downTransport;
        if (!transport) {
            console.log("[consume] recv transport missing:", socket.id);
            return cb({ error: "no recv transport" });
        }
        if (!room.router) {
            console.log("[consume] router not found");
            return cb({ error: "router not found" });
        }
        const canConsume = room.router.canConsume({
            producerId,
            rtpCapabilities,
        });
        if (!canConsume) {
            console.log("[consume] cannot consume producer:", producerId);
            return cb({ error: "cannot consume" });
        }
        console.log("[consume] can consume producer:", producerId);
        const consumer = yield transport.consume({
            producerId,
            rtpCapabilities,
            paused: true,
        });
        peer.addConsumer(consumer);
        consumer.on("transportclose", () => {
            console.log("[consume] transport closed for consumer:", consumer.id);
        });
        consumer.on("producerclose", () => {
            console.log("[consume] producer closed for consumer:", consumer.id);
            peer.removeConsumer(consumer.id);
        });
        cb({
            id: consumer.id,
            producerId,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters,
        });
    }
    catch (error) {
        console.error("[consume] error:", error);
        cb({ error: "consume failed" });
    }
});
exports.handleConsume = handleConsume;
