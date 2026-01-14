import { Send } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { FormEvent } from "react";

const ChatPanel = () => {

    const sendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // hook socket emit here later
    }

    return (
        <div className="flex flex-col h-full">

            {/* Messages */}
            <ScrollArea className="flex-1 min-h-0 px-6">
                <div className="space-y-6">
                    <div className="flex gap-3 items-start">
                        <Avatar className="h-9 w-9 border">
                            <AvatarImage src="https://i.pravatar.cc/150?u=1" />
                            <AvatarFallback>SR</AvatarFallback>
                        </Avatar>

                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-primary">
                                Sahil Rajput (Instructor)
                            </p>

                            <div className="bg-primary/10 text-sm p-3 rounded-2xl rounded-tl-none border border-primary/20">
                                Welcome everyone! Today we will implement WebRTC in Java. Ready?
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 items-start">
                        <Avatar className="h-9 w-9 border">
                            <AvatarImage src="https://i.pravatar.cc/150?u=1" />
                            <AvatarFallback>SR</AvatarFallback>
                        </Avatar>

                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-primary">
                                Sahil Rajput (Instructor)
                            </p>

                            <div className="bg-primary/10 text-sm p-3 rounded-2xl rounded-tl-none border border-primary/20">
                                Welcome everyone! Today we will implement WebRTC in Java. Ready?
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 items-start">
                        <Avatar className="h-9 w-9 border">
                            <AvatarImage src="https://i.pravatar.cc/150?u=1" />
                            <AvatarFallback>SR</AvatarFallback>
                        </Avatar>

                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-primary">
                                Sahil Rajput (Instructor)
                            </p>

                            <div className="bg-primary/10 text-sm p-3 rounded-2xl rounded-tl-none border border-primary/20">
                                Welcome everyone! Today we will implement WebRTC in Java. Ready?
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 items-start">
                        <Avatar className="h-9 w-9 border">
                            <AvatarImage src="https://i.pravatar.cc/150?u=1" />
                            <AvatarFallback>SR</AvatarFallback>
                        </Avatar>

                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-primary">
                                Sahil Rajput (Instructor)
                            </p>

                            <div className="bg-primary/10 text-sm p-3 rounded-2xl rounded-tl-none border border-primary/20">
                                Welcome everyone! Today we will implement WebRTC in Java. Ready?
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 items-start">
                        <Avatar className="h-9 w-9 border">
                            <AvatarImage src="https://i.pravatar.cc/150?u=1" />
                            <AvatarFallback>SR</AvatarFallback>
                        </Avatar>

                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-primary">
                                Sahil Rajput (Instructor)
                            </p>

                            <div className="bg-primary/10 text-sm p-3 rounded-2xl rounded-tl-none border border-primary/20">
                                Welcome everyone! Today we will implement WebRTC in Java. Ready?
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 items-start">
                        <Avatar className="h-9 w-9 border">
                            <AvatarImage src="https://i.pravatar.cc/150?u=1" />
                            <AvatarFallback>SR</AvatarFallback>
                        </Avatar>

                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-primary">
                                Sahil Rajput (Instructor)
                            </p>

                            <div className="bg-primary/10 text-sm p-3 rounded-2xl rounded-tl-none border border-primary/20">
                                Welcome everyone! Today we will implement WebRTC in Java. Ready?
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 items-start">
                        <Avatar className="h-9 w-9 border">
                            <AvatarImage src="https://i.pravatar.cc/150?u=1" />
                            <AvatarFallback>SR</AvatarFallback>
                        </Avatar>

                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-primary">
                                Sahil Rajput (Instructor)
                            </p>

                            <div className="bg-primary/10 text-sm p-3 rounded-2xl rounded-tl-none border border-primary/20">
                                Welcome everyone! Today we will implement WebRTC in Java. Ready?
                            </div>
                        </div>
                    </div>


                    {/* Student message example */}
                    <div className="flex gap-3 items-start">
                        <Avatar className="h-9 w-9 border">
                            <AvatarImage src="https://i.pravatar.cc/150?u=2" />
                            <AvatarFallback>ST</AvatarFallback>
                        </Avatar>

                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-muted-foreground">
                                Student User
                            </p>

                            <div className="bg-muted text-sm p-3 rounded-2xl rounded-tl-none">
                                Yes sir, ready 👍
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border shrink-0">
                <form
                    className="flex gap-2"
                    onSubmit={(e) => sendMessage(e)}
                >
                    <Input
                        placeholder="Message students..."
                        className="bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/60"
                    />

                    <Button
                        size="icon"
                        className="bg-primary hover:bg-primary/90"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>

        </div>
    );
};

export default ChatPanel;
