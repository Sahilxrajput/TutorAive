import { AppData, Router, Transport } from "mediasoup/node/lib/types";
import Peer from "./peer";

class Room {
  public readonly roomId: string;
  public readonly router: Router;
  public readonly host: Peer;

  private peers: Map<string, Peer>; // socketId -> Peer

  private ended: boolean;

  constructor(roomId: string, router: Router, host: Peer) {
    this.roomId = roomId;
    this.router = router;
    this.host = host;
    this.ended = false;
    this.peers = new Map();
    this.addPeer(host);
  }

  addPeer(peer: Peer): void {
    this.peers.set(peer.socketId, peer);
  }

  getPeer(socketId: string): Peer | undefined {
    return this.peers.get(socketId);
  }

  getHost(): Peer | undefined {
    return this.host;
  }

  getAllPeers(): Peer[] {
    return [...this.peers.values()];
  }

  removePeer(socketId: string) {
    this.peers.delete(socketId);
  }

  hasPeer(userId: string): boolean {
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
        id: producer!.id,
        kind: producer!.kind,
        appData: producer!.appData,
      }));
  }

  getTransportById(transportId: string): Transport | null {
    for (const peer of this.getAllPeers()) {
      if (peer.upTransport?.id === transportId) {
        return peer.upTransport;
      }

      if (peer.downTransport?.id === transportId) {
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
        } catch {}
      }
      peer.consumers.clear();

      // producers
      for (const key of Object.keys(peer.producers) as Array<
        keyof typeof peer.producers
      >) {
        const producer = peer.producers[key];
        if (!producer) continue;

        try {
          producer.removeAllListeners();
          producer.close();
        } catch {}
        peer.producers[key] = null;
      }

      // transports
      if (peer.upTransport) {
        try {
          peer.upTransport.removeAllListeners();
          peer.upTransport.close();
        } catch {}
        peer.upTransport = null;
      }

      if (peer.downTransport) {
        try {
          peer.downTransport.removeAllListeners();
          peer.downTransport.close();
        } catch {}
        peer.downTransport = null;
      }
    }

    // 2. Clear peers map
    this.peers.clear();

    // 3. Close router LAST
    try {
      this.router.close();
    } catch {}

    console.log("[room] room closed:", this.roomId);
  }
}


export default Room;
