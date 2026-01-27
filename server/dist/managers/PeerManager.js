"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.peerManager = exports.peers = void 0;
exports.peers = new Map();
exports.peerManager = {
    add(peer) {
        exports.peers.set(peer.socketId, peer);
    },
    get(socketId) {
        return exports.peers.get(socketId);
    },
    remove(socketId) {
        exports.peers.delete(socketId);
    },
};
