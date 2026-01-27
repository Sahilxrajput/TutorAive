"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomManager = void 0;
const room_1 = __importDefault(require("../classes/room"));
const rooms = new Map(); // roomId -> Room
exports.roomManager = {
    createRoom(roomId, router, host) {
        if (rooms.has(roomId)) {
            throw new Error("Room already exists");
        }
        const room = new room_1.default(roomId, router, host);
        rooms.set(roomId, room);
        return room;
    },
    get(roomId) {
        return rooms.get(roomId);
    },
    add(room) {
        rooms.set(room.roomId, room);
    },
    delete(roomId) {
        rooms.delete(roomId);
    },
};
