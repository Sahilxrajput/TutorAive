import { useEffect, useRef, useState } from "react";
import useSocket from "./useSocket";
import useAuth from "./useAuth";


export function useWebRTC(roomId: string) {
    const [peers, setPeers] = useState<{ [id: string]: MediaStream }>({});
    const localStream = useRef<MediaStream | null>(null);
    const connections = useRef<{ [id: string]: RTCPeerConnection }>({});

    const { user } = useAuth()
    const { socket } = useSocket(user || undefined)

    useEffect(() => {

        if (!socket) return

        const init = async () => {
            localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            socket.emit("join-room", roomId);

            socket.on("user-joined", async (userId: string) => {
                const peerConnection = new RTCPeerConnection();
                connections.current[userId] = peerConnection;

                localStream.current?.getTracks().forEach(track =>
                    peerConnection.addTrack(track, localStream.current!)
                );

                peerConnection.ontrack = (event) => {
                    setPeers(prev => ({ ...prev, [userId]: event.streams[0] }));
                };

                const offer = await peerConnection.createOffer();
                await peerConnection.setLocalDescription(offer);
                socket.emit("offer", { offer, to: userId });
            });

            socket.on("offer", async ({ offer, to }) => {
                const peerConnection = new RTCPeerConnection();
                connections.current[to] = peerConnection;

                localStream.current?.getTracks().forEach(track =>
                    peerConnection.addTrack(track, localStream.current!)
                );

                peerConnection.ontrack = (event) => {
                    setPeers(prev => ({ ...prev, [to]: event.streams[0] }));
                };

                await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                socket.emit("answer", { answer, to });
            });

            socket.on("answer", async ({ answer, to }) => {
                await connections.current[to]?.setRemoteDescription(new RTCSessionDescription(answer));
            });

            socket.on("ice-candidate", ({ candidate, to }) => {
                connections.current[to]?.addIceCandidate(new RTCIceCandidate(candidate));
            });
        };

        init();
    }, [roomId]);

    return { localStream, peers };
}
