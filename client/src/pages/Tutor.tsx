// src/client/Tutor.tsx
import useSocket from "@/hooks/useSocketHandler";
import { useEffect, useRef } from "react";

const iceServers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

export default function Tutor() {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const peerConnections = useRef<Record<string, RTCPeerConnection>>({});
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return

        const start = async () => {
            localStreamRef.current = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = localStreamRef.current;
            }

            socket.emit("join-room", {
                roomId: "class1",
                role: "tutor"
            });
        };

        start();

        // A new student joined
        socket.on("new-student", async ({ studentId }) => {
            const pc = new RTCPeerConnection(iceServers);
            peerConnections.current[studentId] = pc;

            // Send ICE candidates to student
            pc.onicecandidate = e => {
                if (e.candidate) {
                    socket.emit("ice-candidate", { to: studentId, candidate: e.candidate });
                }
            };

            // Add tracks to PC
            localStreamRef.current?.getTracks().forEach(track => {
                pc.addTrack(track, localStreamRef.current!);
            });

            // Offer
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            socket.emit("offer", { to: studentId, sdp: pc.localDescription });
        });

        socket.on("answer", async ({ from, sdp }) => {
            const pc = peerConnections.current[from];
            if (!pc) return;
            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        });

        socket.on("ice-candidate", async ({ from, candidate }) => {
            const pc = peerConnections.current[from];
            if (!pc) return;

            try {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch {
                // ignore errors
            }
        });

        return () => {
            socket.off("new-student");
            socket.off("answer");
            socket.off("ice-candidate");
        };
    }, []);

    return (
        <div>
            <h1>Tutor</h1>
            <video ref={localVideoRef} autoPlay muted style={{ width: 300 }} />
        </div>
    );
}
