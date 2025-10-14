import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import useSocket from "../hooks/UseSocket";
import type { IUser } from "../types/auth";


interface Message {
  userId: string;
  username: string;
  message: string;
  timestamp: string;
}

const ChatRoom: React.FC = () => {
  const { user } = useAuth(); // { token, username, userId }
  const { socket, isConnected, onlineUsers, sendMessage, emitCustomEvent } = useSocket(user || undefined);
  const [classroomId, setClassroomId] = useState('')
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    // socket.emit("join_room", classroomId); // auto-join when effect runs

    const handleReceive = (data: Message) => {
      console.log("rec nsg :", data)
      setMessages((prev) => [...prev, data]);
    };

    socket.on("user_joined",(userId)=>{
      console.log(userId+"joined room confirm")
    })

    socket.on("receive_message", handleReceive);

    return () => {
      socket.emit("leave_room", classroomId);
      socket.off("receive_message", handleReceive);
    };
  }, [socket]);


  // Handle sending a message
  const handleSend = () => {
    if (!input.trim()) return;
    console.log("send msg to room : ", classroomId)
    sendMessage(input.trim(), classroomId);
    setInput("");
  };

  const handleJoinRoom = () => {
    if (!classroomId.trim()) return; // do nothing if empty
    emitCustomEvent("join_room", classroomId.trim(),)
    setClassroomId(""); // optional, clear input
  };


  return (
    <div className="chat-room">
      <h2>Chat Room {onlineUsers.length}</h2>
      <p>Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}</p>

      <div className="online-users">
        <strong>Online Users:</strong>{" "}
        <ul>
          {onlineUsers.map((u: IUser) => (
            <li key={u._id}>{u.username || u.email}</li>
          ))}
        </ul>

      </div>

      <div className="messages" style={{ maxHeight: 300, overflowY: "auto" }}>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.username || msg.userId}:</strong> {msg.message}
            <small> ({new Date(msg.timestamp).toLocaleTimeString()})</small>
          </div>
        ))}
      </div>

      <div className="input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend} disabled={!isConnected}>
          Send msg
        </button>
        <input
          type="text"
          value={classroomId}
          onChange={(e) => setClassroomId(e.target.value)}
          placeholder="Type your id..."
        />
        <button onClick={handleJoinRoom} disabled={!isConnected}>
          join room
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
