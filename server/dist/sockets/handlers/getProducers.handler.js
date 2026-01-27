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
exports.handleGetProducers = void 0;
const RoomManager_1 = require("../../managers/RoomManager");
const handleGetProducers = () => (_a, cb_1) => __awaiter(void 0, [_a, cb_1], void 0, function* ({ roomId }, cb) {
    try {
        const room = RoomManager_1.roomManager.get(roomId);
        if (!room) {
            console.log("[get-producers] room not found:", roomId);
            return cb([]);
        }
        const producers = room.getTeacherProducers();
        console.log("producers ==> ", producers);
        cb(producers);
    }
    catch (error) {
        console.error("[get-producers] error:", error);
        cb([]);
    }
});
exports.handleGetProducers = handleGetProducers;
