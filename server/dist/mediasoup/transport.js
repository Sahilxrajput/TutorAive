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
exports.createWebRtcTransport = createWebRtcTransport;
const mediasoup_1 = require("../config/mediasoup");
function createWebRtcTransport(router) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let transport = yield router.createWebRtcTransport(mediasoup_1.webRtcTransport_options);
            console.log(`transport id: ${transport.id}`);
            transport.on("dtlsstatechange", (dtlsState) => {
                if (dtlsState === "closed")
                    transport.close();
            });
            transport.on("@close", () => {
                console.log("transport closed");
            });
            return transport;
        }
        catch (error) {
            console.log("error while createTransport", error);
            return;
        }
    });
}
