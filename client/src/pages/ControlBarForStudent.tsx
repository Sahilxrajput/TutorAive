import { Button } from '@/components/ui/button';
import { useFullscreen } from '@/hooks/useFullscreen';
import { Maximize, MessageCircle, Minimize, PhoneOff, Share2 } from 'lucide-react';
import {  useState } from 'react';
import { toast } from 'sonner';

type Props = {
    isChatOpen: boolean;
    onToggleChat: () => void;
    onLeave: () => void;
};


const ControlBarForStudent = ({
    isChatOpen,
    onToggleChat,
    onLeave
}: Props) => {

    const { isFullScreen, toggle } = useFullscreen();
    const [urlCopied, setUrlCopied] = useState(false);


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
}

export default ControlBarForStudent