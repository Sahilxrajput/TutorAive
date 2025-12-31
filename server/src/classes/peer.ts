import { Producer, Transport, Consumer } from "mediasoup/node/lib/types";

class Peer {
  public name: string;
  public userId: string;
  public socketId: string;
  public producer: {
    cam: Producer | null;
    mic: Producer | null;
    screen: Producer | null;
    saudio: Producer | null;
  };
  public upTransport: Transport | null;
  public downTransport: Transport | null;
  public consumers: Consumer[];
  public screen: boolean;

  constructor(name: string, socketId: string, userId: string) {
    this.userId = userId;
    this.name = name;
    this.socketId = socketId;
    this.producer = {
      cam: null,
      mic: null,
      screen: null,
      saudio: null,
    };
    this.upTransport = null;
    this.downTransport = null;
    this.consumers = [];
    this.screen = false;
  }
}

export default Peer;
