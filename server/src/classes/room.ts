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

//   getProducer() {
//     const producers: {
//       id: string;
//       kind: "video" | "audio";
//       appData: AppData;
//     }[] = [];

//     Object.values(this.host.producers).forEach((producer) => {
//       if (!producer) return;
//       producers.push({
//         id: producer.id,
//         kind: producer.kind,
//         appData: producer.appData,
//       });
//     });

//     return producers;
//   }

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
}
export default Room;
