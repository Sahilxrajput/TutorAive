import { useRef, } from "react";
import { Users} from "lucide-react";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import useAuth from "@/hooks/useAuth";
import { motion } from "framer-motion"
import { useFullscreen } from "@/hooks/useFullscreen";

interface VideoStageProps {
    isInstructor: boolean;
    screenRef: React.RefObject<HTMLVideoElement | null>;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    isScreenSharing: boolean;
    isCamOff?: boolean;
    peerCount: number;
}

const VideoStage =
    ({ isInstructor, isScreenSharing, isCamOff, peerCount, screenRef, videoRef }: VideoStageProps) => {
        const { user } = useAuth();
        const containerRef = useRef<HTMLDivElement>(null);
        const { isFullScreen } = useFullscreen()

        return (
            <Card
                ref={containerRef}
                className="relative flex-1 border-none overflow-hidden flex rounded-none items-center justify-center bg-zinc-900"
            >
                {/* Instructor header */}
                {isInstructor && (
                    <div className="absolute top-2 left-0 right-0 flex items-center justify-between px-4 z-20">
                        <Badge className="bg-red-400 w-14 flex items-center gap-1 animate-pulse">
                            <span className="bg-white rounded-full h-2 w-2" />
                            Live
                        </Badge>

                        <Badge className="bg-card flex items-center gap-2">
                            <Users className="h-3.5 w-3.5" />
                            {peerCount} watching
                        </Badge>
                    </div>
                )}

                {/* Screen share */}
                {isScreenSharing && <video
                    ref={screenRef}
                    autoPlay
                    playsInline
                    className="absolute inset-0 w-full aspect-square object-contain"
                />}


                {/* Self preview */}
                <motion.div
                    drag={isScreenSharing}
                    dragConstraints={containerRef}
                    dragMomentum={false}
                    dragElastic={0.15}
                    initial={false}
                    animate={
                        isScreenSharing
                            ? {
                                width: 300, // w-56
                                bottom: 24,
                                right: 24,
                                left: "auto",
                                top: "auto",
                                borderRadius: 16,
                                scale: 0.95,
                            }
                            : {
                                width: "100%",
                                top: 0,
                                left: 0,
                                bottom: "auto",
                                right: "auto",
                                borderRadius: 0,
                                scale: 1,
                            }
                    }
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                    }}
                    className="absolute bg-zinc-900 border border-white/10 shadow-2xl overflow-hidden aspect-video"
                >
                    {isCamOff && isFullScreen ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <Avatar className="h-16 w-16 border-2 border-primary">
                                <AvatarImage src={user?.profilePicture} />
                                <AvatarFallback>SR</AvatarFallback>
                            </Avatar>
                        </div>
                    ) : (
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                                className="w-full h-full object-cover pointer-events-none"
                        />
                    )}

                    <Badge className="absolute bottom-2 left-2 bg-black/60 text-[10px]">
                        You
                    </Badge>
                </motion.div>

            </Card>
        );
    }

export default VideoStage;
