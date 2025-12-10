import { AppData, Consumer, Router } from "mediasoup/node/lib/types";
import Peer from "./peer";

class Room {
  public ended: boolean;
  public roomId: string;
  public router: Router | null;
  public peers: Map<string, Peer>;
  public host: Peer;
  public consumers: Consumer[];

  constructor(roomId: string, router: Router, host: Peer) {
    this.ended = false;
    this.host = host;
    this.roomId = roomId;
    this.router = router;
    this.peers = new Map();
    this.consumers = [];
    this.addPeer(host);
  }

  addPeer(peer: Peer) {
    this.peers.set(peer.socketId, peer);
  }

  removePeer(socketId: string) {
    this.peers.delete(socketId);
  }

  getPeer(socketId: string) {
    return this.peers.get(socketId);
  }

  isEmpty(): boolean {
    return this.peers.size === 0;
  }

//   getProducer() {
//     const producersInfo: {
//       id: string;
//       kind: "video" | "audio";
//       appData: AppData;
//     }[] = [];
//     this.peers.forEach((peer) => {
//       let producer = peer.producer.cam;
//       if (producer) {
//         producersInfo.push({
//           id: producer.id,
//           kind: producer.kind,
//           appData: producer.appData,
//         });
//       }
//       producer = peer.producer.mic;
//       if (producer) {
//         producersInfo.push({
//           id: producer.id,
//           kind: producer.kind,
//           appData: producer.appData,
//         });
//       }
//       producer = peer.producer.screen;
//       if (producer) {
//         producersInfo.push({
//           id: producer.id,
//           kind: producer.kind,
//           appData: producer.appData,
//         });
//       }
//       producer = peer.producer.saudio;
//       if (producer) {
//         producersInfo.push({
//           id: producer.id,
//           kind: producer.kind,
//           appData: producer.appData,
//         });
//       }
//     });
//     console.log("-----Producers Info-----", producersInfo);
//     return producersInfo;
//   }

//   getTransportById(transportId: string) {
//     const peer = this.peers.find(
//       (p) =>
//         p.downTransport?.id == transportId || p.upTransport?.id == transportId
//     );
//     if (peer) {
//       return peer.downTransport?.id == transportId
//         ? peer.downTransport
//         : peer.upTransport;
//     }
//     return null;
//   }

//   getConsumerById(consumerId: string) {
//     const peer = this.peers.find((p) =>
//       p.consumers.find((c) => c.id === consumerId)
//     );
//     if (peer) {
//       return peer.consumers.find((c) => c.id === consumerId);
//     }
//     return null;
//   }

  //   async getPlainTransport() {
  //     if (!this.router) return null;
  //     const transport = await this.router.createPlainTransport({
  //       listenIp: { ip: "0.0.0.0", announcedIp: process.env.ANNOUNCED_IP },
  //       rtcpMux: true,
  //       comedia: false,
  //     });
  //     return transport;
  //   }
}
export default Room;
