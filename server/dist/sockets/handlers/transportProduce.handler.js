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
exports.handleTransportProduce = void 0;
const RoomManager_1 = require("../../managers/RoomManager");
const PeerManager_1 = require("../../managers/PeerManager");
const handleTransportProduce = (socket) => (_a, cb_1) => __awaiter(void 0, [_a, cb_1], void 0, function* ({ roomId, kind, transportId, rtpParameters, appData, }, cb) {
    try {
        console.log("request to create producer");
        const room = RoomManager_1.roomManager.get(roomId);
        if (!room)
            return cb({ error: "room not found" });
        const transport = room.getTransportById(transportId);
        if (!transport)
            return cb({ error: "transport not found" });
        const producer = yield transport.produce({
            kind,
            rtpParameters,
            appData,
        });
        const peer = PeerManager_1.peerManager.get(socket.id);
        if (!peer)
            return cb({ error: "peer not found" });
        switch (appData.mediaTag) {
            case "cam-video":
                peer.producers.cam = producer;
                break;
            case "mic-audio":
                peer.producers.mic = producer;
                break;
            case "screen-video":
                peer.producers.screen = producer;
                break;
            case "screen-audio":
                peer.producers.saudio = producer;
                break;
            default:
                console.warn("unknown mediaTag:", appData.mediaTag);
        }
        // THIS IS THE IMPORTANT PART
        socket.to(roomId).emit("new-producer", {
            producerId: producer.id,
            appData: producer.appData,
        });
        producer.on("transportclose", () => {
            console.log("transport for this producer closed");
            producer.close();
        });
        cb({ id: producer.id });
    }
    catch (error) {
        console.error(error);
        cb({ error: "failed to create producer" });
    }
});
exports.handleTransportProduce = handleTransportProduce;
