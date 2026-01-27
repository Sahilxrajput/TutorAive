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
exports.handleConsumerResume = void 0;
const RoomManager_1 = require("../../managers/RoomManager");
const handleConsumerResume = (socket) => (_a) => __awaiter(void 0, [_a], void 0, function* ({ roomId, consumerId }) {
    console.log("resume enter");
    const room = RoomManager_1.roomManager.get(roomId);
    if (!room) {
        console.log("[consumer-resume] room not found:", roomId);
        return;
    }
    const peer = room.getPeer(socket.id);
    if (!peer) {
        console.log("[consumer-resume] peer not found:", socket.id);
        return;
    }
    const consumer = peer.consumers.get(consumerId);
    if (!consumer) {
        console.log("[consumer-resume] consumer not found:", consumerId);
        return;
    }
    console.log("[consumer-resume] resuming consumer:", consumerId);
    yield consumer.resume();
    // socket
    //   .to(peer.roomId!)
    //   .emit("join:live-lecture", {
    //     message: `${socket.data.userName} joined the room`,
    //   });
});
exports.handleConsumerResume = handleConsumerResume;
