import { Button } from '@/components/ui/button';
import { Copy, MessageCircle, PhoneOff, Share2 } from 'lucide-react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

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

    const url = useParams()

    useEffect(() => {
        console.log("para: ", url)
    }, [])

    function copyUrlToClipboard() {
        console.log("url: ", url)
        const urlToCopy = `${import.meta.env.VITE_API_URL}/${url}`
        navigator.clipboard.writeText(urlToCopy).then(() => {
            // setUrlCopied(true);
            // setTimeout(() => setUrlCopied(false), 2000);
        });
    }

    const onShare = () => {

    }

    return (
        <footer className="flex justify-center py-4 absolute bottom-2 right-1/2 left-1/2">
            <div className="flex bg-muted/50 p-1.5 rounded-full border gap-2">
                <Button onClick={onToggleChat} variant={isChatOpen ? "default" : "ghost"} className="rounded-full h-12 w-12">
                    {isChatOpen ? <MessageCircle /> : <MessageCircle />}
                </Button>

                <Button onClick={onShare} variant={isChatOpen ? "default" : "ghost"} className="rounded-full h-12 w-12">
                    <Share2 />
                </Button>


                <Button onClick={onLeave} variant="destructive" className="rounded-full h-12 px-8 gap-2">
                    <PhoneOff /> Leave
                </Button>
            </div>
        </footer>
    );
}

export default ControlBarForStudent