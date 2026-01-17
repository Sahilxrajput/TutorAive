import { useRef,  } from "react";
import { MonitorUp, Users, Video } from "lucide-react";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import useAuth from "@/hooks/useAuth";
import { motion } from "framer-motion"
import { cn } from "@/lib/utils";
import { useFullscreen } from "@/hooks/useFullscreen";

interface VideoStageProps {
    isInstructor: boolean;
    screenRef: React.RefObject<HTMLVideoElement | null>;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    isSharing?: boolean;
    isCamOff?: boolean;
    viewerCount: number;
}

const VideoStage =
    ({ isInstructor, isSharing, isCamOff, viewerCount, screenRef, videoRef }: VideoStageProps) => {
        const { user } = useAuth();
        const containerRef = useRef<HTMLDivElement>(null);
        const { isFullScreen } = useFullscreen()



        return (
            <Card
                ref={containerRef}
                className="flex-1 bg-black border-none overflow-hidden relative flex rounded-none items-center justify-center"
            >
                {/* Instructor header */}
                {isInstructor && (
                    <div className="absolute top-2 left-0 right-0 flex items-center justify-between px-4">
                        <Badge className="bg-red-400 w-14 flex items-center gap-1 animate-pulse">
                            <span className="bg-white rounded-full h-2 w-2" />
                            Live
                        </Badge>

                        <Badge className="bg-card-foreground flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {viewerCount} watching
                        </Badge>
                    </div>
                )}

                {/* Main stage */}
                <div className="text-zinc-500 flex flex-col items-center">
                    {!isSharing ? (
                        <MonitorUp size={64} className="mb-4 text-blue-500 animate-pulse" />
                    ) : (
                        <Video size={64} className="mb-4" />
                    )}
                    <p className="text-lg font-medium">
                        {isSharing ? "You are presenting your screen" : "Video Feed Active"}
                    </p>
                </div>

                {/* Screen share */}
                <video
                    ref={screenRef}
                    autoPlay
                    playsInline
                    className={cn(
                        "absolute inset-0 w-full h-full object-contain",
                        !isSharing && "hidden"
                    )}
                />


                {/* Self preview */}
                <motion.div
                    drag
                    dragConstraints={containerRef}
                    dragMomentum={false}
                    dragElastic={0.1}
                    className="absolute bottom-6 right-6 w-56 aspect-video
                    bg-zinc-900 rounded-xl border border-white/10
                      shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
                >

                    {isCamOff && isFullScreen ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <Avatar className="h-16 w-16 border-2 border-primary">
                                {/* @todo teacher img not consumer's */}
                                <AvatarImage src={user?.profilePicture} />
                                <AvatarFallback>SR</AvatarFallback>
                            </Avatar>
                        </div>
                    ) : (
                            <motion.video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                className={cn(
                                    "w-full h-full object-cover",
                                    isFullScreen && "fixed inset-0 w-screen h-screen z-50"
                                )}
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
