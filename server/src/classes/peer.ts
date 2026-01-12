import { Producer, Transport, Consumer } from "mediasoup/node/lib/types";
import Room from "./room";

class Peer {
  public readonly userId: string;
  public readonly socketId: string;
  public readonly name: string;

  public upTransport: Transport | null;
  public downTransport: Transport | null;

  public producers: {
    cam: Producer | null;
    mic: Producer | null;
    screen: Producer | null;
    saudio: Producer | null;
  };

  public consumers: Map<string, Consumer>;
  public screen: boolean;

  constructor(name: string, socketId: string, userId: string) {
    this.userId = userId;
    this.name = name;
    this.socketId = socketId;
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

  addConsumer(consumer: Consumer) {
    this.consumers.set(consumer.id, consumer);
  }

  getConsumer(consumerId: string) {
    return this.consumers.get(consumerId);
  }

  removeConsumer(consumerId: string) {
    this.consumers.delete(consumerId);
  }
}
export default Peer;
