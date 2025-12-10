import  { useCallback, useEffect, useState } from 'react'
import type { Socket } from 'socket.io-client'

const useSocketRoom = (socket: Socket, roomId: string) => {
    const [peers, setPeers] = useState([])
    const [isInRoom, setIsInRoom] = useState<boolean>(false)
    const [roomInfo, setRoomInfo] = useState()

    const joinRoom = useCallback(() => {
        if (socket && roomId) {
            socket.emit("join_room", { roomId });
        }
    }, [socket, roomId]);

    const leaveRoom = useCallback(() => {
        if (socket && roomId) {
            socket.emit("leave_room", { roomId });
        }
    }, [socket, roomId]);

    useEffect(() => {
        if (!socket) return;

        socket.on("joined_room", (data) => {
            // setRoomInfo(data);
            setIsInRoom(true);
            if (Array.isArray(data.peers)) {
                setPeers(data.peers);
            }
        });

        socket.on("room_left", () => {
            setIsInRoom(false);
            setMessages([]);
            setPeers([]);
        });

        socket.on("user_joined_room", (data) => {
            setPeers((prev) => {
                const alreadyExists = prev.some((p) => p.userId === data.userId);
                if (alreadyExists) return prev;
                const updated = [...prev, { userId: data.userId, name: data.name }];
                return updated;
            });

            setMessages((prev) => [
                ...prev,
                {
                    id: `system_${Date.now()}`,
                    messageType: "system",
                    message: `${data.name} joined the room`,
                    timestamp: new Date(),
                },
            ]);
        });

        socket.on("user_left_room", (data) => {
            setPeers((prev) => prev.filter((p) => p.userId !== data.userId));

            setMessages((prev) => [
                ...prev,
                {
                    id: `system_${Date.now()}`,
                    messageType: "system",
                    message: `${data.name} left the room`,
                    timestamp: new Date(),
                },
            ]);
        });

        joinRoom();

        return () => {
            socket.off("room_joined");
            socket.off("room_left");
            socket.off("user_joined_room");
            socket.off("user_left_room");
        };
    }, [socket, joinRoom]);



    return {
        isInRoom,
        peers,
        roomInfo
    }

}

export default useSocketRoom