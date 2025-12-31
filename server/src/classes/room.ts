import { AppData, Consumer, Router } from "mediasoup/node/lib/types";
import Peer from "./peer";
import { CreateWorker } from "../sockets/handlers/createWorker";
import { mediaCodecs } from "../config/mediasoup";

class Room {
  public readonly roomId: string;
  public readonly router: Router;
  public readonly host: Peer;

  private ended: boolean;
  private peers: Map<string, Peer>; // socketId -> Peer
  private consumers: Consumer[];

  constructor(roomId: string, router: Router, host: Peer) {
    this.roomId = roomId;
    this.router = router;
    this.host = host;
    this.ended = false;
    this.peers = new Map();
    this.consumers = [];

    this.addPeer(host);
  }

  getProducer() {
    const producersInfo: {
      id: string;
      kind: "video" | "audio";
      appData: AppData;
    }[] = [];

    this.peers.forEach((peer) => {
      Object.values(peer.producer).forEach((producer) => {
        if (!producer) return;

        producersInfo.push({
          id: producer.id,
          kind: producer.kind,
          appData: producer.appData,
        });
      });
    });
    // console.log("=============== producer Info ===============");
    // console.log(producersInfo);/
    return producersInfo;
  }

  // 1. Find the Peer (User) by Transport ID
  getPeerByTransportId(transportId: string) {
    for (const peer of this.peers.values()) {
      if (
        peer.downTransport?.id === transportId ||
        peer.upTransport?.id === transportId
      ) {
        return peer;
      }
    }
    return null;
  }

  // 2. Fixed version of your getTransportById
  getTransportById(transportId: string) {
    // Re-use the method above to find the peer first
    const peer = this.getPeerByTransportId(transportId);
    // console.log("peer : ",peer)
    if (peer) {
      if (peer.downTransport?.id === transportId) {
        return peer.downTransport;
      } else if (peer.upTransport?.id === transportId) {
        return peer.upTransport;
      }
    }
    return null;
  }

  addPeer(peer: Peer): void {
    this.peers.set(peer.socketId, peer);
  }

  removePeer(socketId: string): void {
    this.peers.delete(socketId);
  }

  getPeer(socketId: string): Peer | undefined {
    return this.peers.get(socketId);
  }

  getConsumerById(consumerId: string) {
    return this.consumers.find((c) => c.id === consumerId);
  }

  haspeer(socketId: string): boolean {
    return this.peers.has(socketId);
  }

  getAllPeers(): Peer[] {
    return [...this.peers.values()];
  }

  peerCount(): number {
    return this.peers.size;
  }

  isEmpty(): boolean {
    return this.peers.size === 0;
  }

  end(): void {
    this.ended = true;
    this.peers.clear();
    this.consumers = [];
  }

  isEnded(): boolean {
    return this.ended;
  }
}
export default Room;
