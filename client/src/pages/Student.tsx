// src/client/Student.tsx
import useSocket from "@/hooks/useSocketHandler";
import { useEffect, useRef } from "react";



const iceServers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

export default function Student() {
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const { socket } = useSocket();


    useEffect(() => {
        if (!socket) return
        socket.emit("join-room", {
            roomId: "class1",
            role: "student"
        });

        socket.on("offer", async ({ from, sdp }) => {
            const pc = new RTCPeerConnection(iceServers);
            pcRef.current = pc;

            pc.ontrack = e => {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = e.streams[0];
                }
            };

            pc.onicecandidate = e => {
                if (e.candidate) {
                    socket.emit("ice-candidate", { to: from, candidate: e.candidate });
                }
            };

            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
            const answer = await pc.createAnswer();

            await pc.setLocalDescription(answer);
            socket.emit("answer", { to: from, sdp: pc.localDescription });
        });

        socket.on("ice-candidate", async ({ candidate }) => {
            try {
                await pcRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
            } catch {
                // ignore
            }
        });

        return () => {
            socket.off("offer");
            socket.off("ice-candidate");
        };
    }, []);

    return (
        <div>
            <h1>Student</h1>
            <video ref={remoteVideoRef} autoPlay style={{ width: 400 }} />
        </div>
    );
}
