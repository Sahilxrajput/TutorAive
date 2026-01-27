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
exports.handleTransportConnect = void 0;
const RoomManager_1 = require("../../managers/RoomManager");
const handleTransportConnect = () => (_a, cb_1) => __awaiter(void 0, [_a, cb_1], void 0, function* ({ transportId, dtlsParameters, roomId }, cb) {
    try {
        console.log("request on server to connect-transport DTLS PARAMS : ", dtlsParameters);
        console.log("request on server to connect-transport transportId : ", transportId);
        const room = RoomManager_1.roomManager.get(roomId);
        if (!room)
            return cb({ error: "room not found" });
        // const producer = room.getProducer();
        const transport = room.getTransportById(transportId);
        if (!transport)
            return cb({ error: "transport not found" });
        yield transport.connect({ dtlsParameters });
        console.log(`transport connected successfully`);
        cb({ connect: true });
        //   cb({ producer: producer }); //@note can be removed
    }
    catch (error) {
        console.log(error);
        cb({ error: error });
    }
});
exports.handleTransportConnect = handleTransportConnect;
