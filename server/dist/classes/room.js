"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Room {
    constructor(roomId, router, host) {
        this.roomId = roomId;
        this.router = router;
        this.host = host;
        this.peers = new Map();
        this.addPeer(host);
    }
    addPeer(peer) {
        this.peers.set(peer.socketId, peer);
    }
    getPeer(socketId) {
        return this.peers.get(socketId);
    }
    getHost() {
        return this.host;
    }
    getAllPeers() {
        return [...this.peers.values()];
    }
    removePeer(socketId) {
        this.peers.delete(socketId);
    }
    hasPeer(userId) {
        for (const peer of this.peers.values()) {
            if (peer.userId === userId) {
                return true;
            }
        }
        return false;
    }
    getTeacherProducers() {
        return Object.values(this.host.producers)
            .filter(Boolean)
            .map((producer) => ({
            id: producer.id,
            kind: producer.kind,
            appData: producer.appData,
        }));
    }
    getTransportById(transportId) {
        var _a, _b;
        for (const peer of this.getAllPeers()) {
            if (((_a = peer.upTransport) === null || _a === void 0 ? void 0 : _a.id) === transportId) {
                return peer.upTransport;
            }
            if (((_b = peer.downTransport) === null || _b === void 0 ? void 0 : _b.id) === transportId) {
                return peer.downTransport;
            }
        }
        return null;
    }
    close() {
        console.log("[room] closing room:", this.roomId);
        // 1. Close all peers
        for (const peer of this.peers.values()) {
            // consumers
            for (const consumer of peer.consumers.values()) {
                try {
                    consumer.removeAllListeners();
                    consumer.close();
                }
                catch (_a) { }
            }
            peer.consumers.clear();
            // producers
            for (const key of Object.keys(peer.producers)) {
                const producer = peer.producers[key];
                if (!producer)
                    continue;
                try {
                    producer.removeAllListeners();
                    producer.close();
                }
                catch (_b) { }
                peer.producers[key] = null;
            }
            // transports
            if (peer.upTransport) {
                try {
                    peer.upTransport.removeAllListeners();
                    peer.upTransport.close();
                }
                catch (_c) { }
                peer.upTransport = null;
            }
            if (peer.downTransport) {
                try {
                    peer.downTransport.removeAllListeners();
                    peer.downTransport.close();
                }
                catch (_d) { }
                peer.downTransport = null;
            }
        }
        // 2. Clear peers map
        this.peers.clear();
        // 3. Close router LAST
        try {
            this.router.close();
        }
        catch (_e) { }
        console.log("[room] room closed:", this.roomId);
    }
}
exports.default = Room;
