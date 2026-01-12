import Peer from "../classes/peer";

export const peers = new Map<string, Peer>();

export const peerManager = {
  add(peer: Peer) {
    peers.set(peer.socketId, peer);
  },

  get(socketId: string) {
    return peers.get(socketId);
  },

  remove(socketId: string) {
    peers.delete(socketId);
  },

  
};