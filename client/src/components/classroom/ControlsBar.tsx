import { Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff, Send, MessageCircle, Share2, Minimize, Maximize } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useFullscreen } from "@/hooks/useFullscreen";

type Props = {
    isMuted: boolean;
    isCamOff: boolean;
    isChatOpen: boolean;
    isSharing: boolean;
    onToggleMute: () => void;
    onToggleChat: () => void;
    onToggleCam: () => void;
    onToggleShare: () => void;
    onLeave: () => void;
};

const ControlsBar = ({
    isMuted,
    isChatOpen,
    isCamOff,
    isSharing,
    onToggleMute,
    onToggleCam,
    onToggleChat,
    onToggleShare,
    onLeave
}: Props) => {
    const [urlCopied, setUrlCopied] = useState(false);
    const { isFullScreen, toggle } = useFullscreen();


    function copyUrlToClipboard() {
        const urlToCopy = window.location.href;

        navigator.clipboard
            .writeText(urlToCopy)
            .then(() => {
                setUrlCopied(true);

                toast.success("Copied", {
                    duration: 2000,
                });

                setTimeout(() => setUrlCopied(false), 2000);
            })
            .catch(() =>
                toast.warning("Something went wrong", {
                    duration: 2000,
                })
            );
    }

    return (
        <footer className="flex justify-center py-4 absolute bottom-2 right-1/2 left-1/2">
            <div className="flex bg-muted/50 p-1.5 rounded-full border gap-2">
                <Button onClick={onToggleChat} variant={isChatOpen ? "default" : "ghost"} className="rounded-full h-12 w-12">
                    {isChatOpen ? <MessageCircle /> : <MessageCircle />}
                </Button>

                <Button onClick={copyUrlToClipboard} variant={urlCopied ? "default" : "ghost"} className="rounded-full h-12 w-12">
                    <Share2 />
                </Button>

                <Button onClick={onToggleMute} variant={isMuted ? "destructive" : "ghost"} className="rounded-full h-12 w-12">
                    {isMuted ? <MicOff /> : <Mic />}
                </Button>

                <Button onClick={onToggleCam} variant={isCamOff ? "destructive" : "ghost"} className="rounded-full h-12 w-12">
                    {isCamOff ? <VideoOff /> : <Video />}
                </Button>

                <Button onClick={onToggleShare} variant={isSharing ? "default" : "ghost"} className="rounded-full h-12 w-12">
                    <MonitorUp />
                </Button>

                <Button onClick={toggle} variant="ghost" className='rounded-full h-12 w-12'>
                    {isFullScreen ? (
                        <Minimize className="h-5 w-5" />
                    ) : (
                        <Maximize className="h-5 w-5" />
                    )}
                </Button>

                <Button onClick={onLeave} variant="destructive" className="rounded-full h-12 px-8 gap-2">
                    <PhoneOff /> Leave
                </Button>
            </div>
        </footer>
    );
};

export default ControlsBar;
