"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Peer {
    constructor({ name, socketId, userId, roomId, }) {
        this.userId = userId;
        this.name = name;
        this.socketId = socketId;
        this.roomId = roomId;
        this.producers = {
            cam: null,
            mic: null,
            screen: null,
            saudio: null,
        };
        this.upTransport = null;
        this.downTransport = null;
        this.consumers = new Map();
        this.screen = false;
    }
    addConsumer(consumer) {
        this.consumers.set(consumer.id, consumer);
    }
    getConsumer(consumerId) {
        return this.consumers.get(consumerId);
    }
    removeConsumer(consumerId) {
        let a = this.consumers.delete(consumerId);
        console.log("successfully removed", a);
    }
}
exports.default = Peer;
