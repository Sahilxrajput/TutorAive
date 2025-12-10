import React, { useEffect, useRef, useState } from "react";
import useSocket from "@/hooks/useSocketHandler";

const LiveSession = () => {
    const { socket, isConnected, onlineUsers } = useSocket();

    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const [sendingPc, setSendingPc] = useState<null | RTCPeerConnection>(null);
    const [receivingPc, setReceivingPc] = useState<null | RTCPeerConnection>(null);
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<any[]>([]);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [videoAvailable, setVideoAvailable] = useState<boolean>(false);
    const [audioAvailable, setAudioAvailable] = useState<boolean>(false);
    const [screenAvailable, setScreenAvailable] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [roomId, setRoomId] = useState<string>("");

    useEffect(() => {
        // getPermissions();
        if (!socket) return

        socket.on("user_joined", (data: { userId: string }) => {
            console.log(`User joined: ${data.userId}`);
        });

        socket.on("user_left", (data: { userId: string }) => {
            console.log(`User left: ${data.userId}`);
        });

        socket.on("online_users_updated", (users: any) => {
            console.log("user updated" + users)
        });

        socket.on("receive_message", (msg: any) => {
            console.log("msg received : ", msg)
            setMessages((prev) => [...prev, msg]);
        });

        // cleanup on unmount
        return () => {
            socket.disconnect()
        };
    }, [socket]);

    const getPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            setMediaStream(stream);
            console.log("stream", stream)

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            setVideoAvailable(stream.getVideoTracks().length > 0);
            setAudioAvailable(stream.getAudioTracks().length > 0);

            // check for screen sharing support
            //@ts-ignore
            setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);

            console.log("✅ Camera & mic permissions granted.");
        } catch (err: any) {
            console.error("Permission error:", err);
            setError("Failed to access camera or microphone. Please allow permissions.");
            setVideoAvailable(false);
            setAudioAvailable(false);
            setScreenAvailable(false);
        }
    };

    const joinRoom = () => {
        if (socket && roomId.trim()) {
            socket.emit("join_room", roomId);
            console.log(`Joined room ${roomId}`);
        }
    };

    const leaveRoom = () => {
        if (socket && roomId.trim()) {
            socket.emit("leave_room", roomId);
            console.log(`Left room ${roomId}`);
            setMessages([]);
        }
    };

    const sendMessage = () => {
        if (!message.trim() || !roomId.trim() || !socket) return;
        const payload = {
            roomId,
            message,
        };
        socket.emit("send_message", payload);
        setMessage("");
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Live Session</h1>

            {/* Room Controls */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Enter room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
                />
                <button
                    onClick={joinRoom}
                    disabled={!socket || isConnected === false}
                    className="bg-green-600 px-3 py-2 rounded hover:bg-green-500 transition"
                >
                    Join
                </button>
                <button
                    onClick={leaveRoom}
                    className="bg-red-600 px-3 py-2 rounded hover:bg-red-500 transition"
                >
                    Leave
                </button>
            </div>

            {/* Chat Section */}
            <div className="flex flex-1 gap-4">
                {/* Messages */}
                <div className="flex-1 bg-gray-900 rounded-lg p-3  overflow-y-auto">
                    {messages.map((msg, idx) => (
                        <div key={idx} className="mb-2">
                            <span className="font-semibold text-green-400">
                                {msg.userName || msg.userId}:
                            </span>{" "}
                            {msg.message}
                            <div className="text-xs text-gray-500">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Online Users */}
                <div className="w-1/4 bg-gray-900 rounded-lg p-3">
                    <h2 className="font-bold mb-2">Online Users</h2>
                    <ul className="text-sm space-y-1">
                        {onlineUsers.map((u) => (
                            <li key={u._id}>
                                {u.userName || "Unknown"}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Message Input */}
            <div className="mt-4 flex gap-2">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default LiveSession;

