import { Send } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState, useEffect, type FormEvent } from "react";
import useSocketContext from "@/hooks/useSocketContext";
import { useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface LiveChatMessage {
    _id: string;
    lectureId: string;
    userId: string;
    userName: string;
    userProfilePicture?: string;
    role: "student" | "instructor";
    message: string;
    createdAt: Date;
}

const ChatPanel = () => {
    const [messages, setMessages] = useState<LiveChatMessage[]>([]);
    const [text, setText] = useState("");
    const { lectureId } = useParams<{ lectureId: string }>();
    const { socket } = useSocketContext();
    const { user } = useAuth();

    const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!socket || !text.trim()) return;

        const { msg }: { msg: LiveChatMessage } = await socket.emitWithAck("chat:send", {
            lectureId,
            user,
            message: text,
        });

        setMessages((prev) => [...prev, msg])

        setText("");
    };

    useEffect(() => {
        if (!socket || !lectureId) return;

        socket.emit(
            "chat:sync",
            { lectureId },
            ({ messages }: { messages: LiveChatMessage[] }) => {
                setMessages(messages);
            }
        );

        socket.on("chat:new", (msg: LiveChatMessage) => {
            setMessages((prev) => [...prev, msg]);
        });

        socket.on("chat:deleted", ({ messageId }: { messageId: string }) => {
            setMessages((prev) => prev.filter((m) => m._id !== messageId));
        });

        return () => {
            socket.off("chat:new");
            socket.off("chat:deleted");
        };
    }, [socket, lectureId]);

    return (
        <div className="flex flex-col h-full">
            {/* Messages */}
            <ScrollArea className="flex-1 min-h-0 px-6">
                <div className="space-y-6 py-4">

                    {messages.length === 0 && (
                        <div className="text-center text-muted-foreground py-10">
                            <p className="font-medium">No messages yet</p>
                            <p className="text-xs">Messages will appear here once they are sent</p>
                        </div>
                    )}

                    {messages.map((msg) => {
                        const isInstructor = msg.role === "instructor";

                        return (
                            <div key={msg._id} className="flex gap-3 items-start">
                                <Avatar className="h-9 w-9 border">
                                    <AvatarImage src={msg.userProfilePicture} />
                                    <AvatarFallback>
                                        {msg.userName.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="space-y-1 max-w-[85%]">
                                    <p
                                        className={cn(
                                            "text-xs font-semibold",
                                            isInstructor
                                                ? "text-primary"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        {msg.userName}
                                        {isInstructor && " (Instructor)"}
                                    </p>

                                    <div
                                        className={cn(
                                            "text-sm p-3 rounded-2xl rounded-tl-none",
                                            isInstructor
                                                ? "bg-primary/10 border border-primary/20"
                                                : "bg-muted"
                                        )}
                                    >
                                        {msg.message}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border shrink-0">
                <form className="flex gap-2" onSubmit={sendMessage}>
                    <Input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Message students..."
                        className="bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/60"
                    />

                    <Button size="icon" className="bg-primary hover:bg-primary/90">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChatPanel;
