import { ITweet } from "@/types/type";
import { Hash } from "lucide-react";
import TweetAvatar from "./TweetAvatar";

export default function ParentTweet({ tweet }: { tweet: ITweet["parentTweet"] }) {
    if (!tweet) return null;
    return (
        <div className="mt-4 p-5 rounded-[1.5rem] border border-primary/10 bg-primary/[0.03] dark:bg-white/[0.02] border-dashed space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TweetAvatar size={6} author={tweet.author} />

                    <div className="flex flex-col -space-y-1">
                        <span className="text-[10px] font-bold font-inter text-foreground/90">{tweet.author?.firstName}</span>
                        <span className="text-[8px] text-muted-foreground uppercase font-oswald tracking-tighter">@{tweet.author?.userName}</span>
                    </div>
                </div>
                <div className="text-[8px] font-bold font-oswald text-primary/40 uppercase tracking-widest flex items-center gap-1">
                    <Hash size={8} /> Linked Sector
                </div>
            </div>
            <p className="text-xs text-muted-foreground font-inter leading-relaxed italic">
                "{tweet.content}"
            </p>
            {tweet.image?.url && (
                <div className="rounded-xl overflow-hidden border border-border/40">
                    <img src={tweet.image.url} className="w-full h-32 object-cover" alt="Parent context" />
                </div>
            )}
        </div>
    );
};