import { formatDate, formatTime } from "@/utils/splitDateTime";
import { Calendar, Clock, ExternalLink, Hash, Repeat2, Trash, Zap } from "lucide-react";
import { AlertConfirmDialog } from "../AlertConfirmDialog";
import useAuth from "@/hooks/useAuth";
import { forwardRef, useState } from "react";
import { useDeleteTweet, useLikeTweet } from "@/tanStack/hooks/useTweets";
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ITweet } from "@/types/type";
import RepostDialog from "./RepostDialog";
import ParentTweet from "./ParentTweet";
import TweetAvatar from "./TweetAvatar";

interface Props {
    tweet: ITweet;
    index: number;
    isCreating?: boolean;
}

const TweetCard = forwardRef<HTMLDivElement, Props>(({ tweet, index }, ref) => {
    const { user } = useAuth();
    const [isRepostOpen, setIsRepostOpen] = useState(false);
    const likeTweet = useLikeTweet();
    const deleteTweet = useDeleteTweet(tweet._id);


    const isLiked = !!user && tweet.likes?.includes(user?._id);
    const isOwner = user?._id === tweet.author?._id;
    const isRepost = !!tweet.parentTweet;

    const requireAuth = () => {
        if (!user) {
            toast.warning("User must be logged in");
            return false;
        }
        return true;
    };

    const handleLike = () => {
        if (!requireAuth()) return;
        likeTweet.mutate(tweet._id);
    };

    const handleRepost = () => {
        if (!requireAuth()) return;
        setIsRepostOpen(true);
    };

    return (<>
        <motion.div
            ref={ref}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -8 }}
            className="group relative bg-card/60 dark:bg-neutral-900/40 backdrop-blur-xl border border-border dark:border-white/5 rounded-[2.5rem] p-7 shadow-xl transition-all duration-500 hover:border-primary/40 flex flex-col h-full overflow-hidden"
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />

            {/* REPOST LABEL & DELETE ACTION */}
            <div className="flex justify-between items-center mb-4 z-10">
                <div className="flex items-center gap-2">
                    {isRepost ? (
                        <div className="flex items-center gap-2 text-primary">
                            <Repeat2 size={12} />
                            <span className="text-[8px] font-bold font-oswald uppercase tracking-[0.3em]">Reposted Segment</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-muted-foreground opacity-40">
                            <Hash size={12} />
                            <span className="text-[8px] font-bold font-oswald uppercase tracking-[0.3em]">Standalone Log</span>
                        </div>
                    )}
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {isOwner && (
                        <AlertConfirmDialog
                            Icon={Trash}
                            title="Purge Communication?"
                            description="This will permanently delete this data packet from the Frontier stream."
                            confirmText="Delete"
                            cancelText="Cancel"
                            onConfirm={() =>
                                deleteTweet.mutate()
                            } />
                    )}
                </div>
            </div>

            <div className="flex gap-4 mb-auto z-10">
                <TweetAvatar size={12} author={tweet.author} />

                <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-bold font-inter text-sm text-foreground leading-none">{tweet.author?.firstName}</h4>
                            <p className="text-[10px] text-muted-foreground uppercase font-oswald tracking-widest mt-1">@{tweet.author?.userName}</p>
                        </div>
                        <div className="px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[8px] font-bold uppercase tracking-tighter">
                            {tweet.type || "General"}
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed font-inter whitespace-pre-wrap break-words">
                        {tweet.content}
                    </p>

                    {tweet.image?.url && (
                        <div className="relative mt-4 rounded-[1.5rem] overflow-hidden border border-border dark:border-white/5 group/img">
                            <img
                                src={tweet.image.url}
                                alt="Tweet attachment"
                                className="w-full h-52 object-cover transition-transform duration-700 group-hover/img:scale-105"
                                draggable={false}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-4">
                                <div className="text-[8px] font-bold font-oswald text-white uppercase tracking-widest flex items-center gap-2">
                                    <ExternalLink size={10} /> Expand Visual Packet
                                </div>
                            </div>
                        </div>
                    )}

                    <ParentTweet tweet={tweet.parentTweet} />
                </div>
            </div>

            {/* FOOTER */}
            <div className="pt-6 mt-6 border-t border-border/40 dark:border-white/5 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLike}
                        className={cn(
                            "flex items-center gap-1.5 text-[10px] font-bold font-oswald uppercase tracking-widest transition-all",
                            isLiked ? "text-primary scale-110" : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        <Zap size={14} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "animate-pulse" : ""} />
                        {tweet.likes?.length || 0}
                    </button>
                    <button
                        onClick={handleRepost}
                        className="flex items-center gap-1.5 text-[10px] font-bold font-oswald uppercase tracking-widest text-muted-foreground hover:text-blue-500 transition-colors"
                    >
                        <Repeat2 size={14} />
                        Repost
                    </button>
                </div>

                <div className="flex flex-col items-end gap-1 opacity-40">
                    <div className="flex items-center gap-2 text-[8px] font-bold font-oswald uppercase tracking-widest">
                        <Clock size={10} /> {formatTime(tweet.createdAt || new Date().toISOString())}
                    </div>
                    <div className="flex items-center gap-2 text-[8px] font-bold font-oswald uppercase tracking-widest">
                        <Calendar size={10} /> {formatDate(tweet.createdAt || new Date().toISOString())}
                    </div>
                </div>
            </div>
        </motion.div>

        <RepostDialog
            isOpen={isRepostOpen}
            onClose={() => setIsRepostOpen(false)}
            parentTweet={tweet}
        />
    </>
    );
});

export default TweetCard;