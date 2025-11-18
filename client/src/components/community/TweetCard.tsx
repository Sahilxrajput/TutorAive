import { Card, CardContent } from "@/components/ui/card";
import { Trash, LinkIcon, Bell, TicketX, BadgeTurkishLira, Heart, Repeat, HeartPlus, HeartMinus } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import type { ITweet } from "@/types/auth";
import { CardFooter } from "../tiptap-ui-primitive/card";
import { AlertConfirmDialog } from "../AlertConfirmDialog";
import { TooltipDemo } from "../TooltipDemo";
import defaultAvatar from "@/assets/image/avatar.png";
import { useEffect, useState } from "react";
import TweetRepost from "./TweetRepost";

interface Props {
    tweet: ITweet;
    cn?: string,
    onDelete?: (id: string) => void;
    onLike?: (id: string) => void;
}

export default function TweetCard({ tweet, onDelete, onLike, cn }: Props) {

    const [isLiked, setIsLiked] = useState(false)
    const [repostDialog, setRepostDialog] = useState(false)
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            setIsLiked(tweet.likes.includes(user._id));
        }
    }, [user, tweet]);



    return (
        <>
            <Card className={`shadow-sm hover:bg-muted/50 pb-4 transition px-4  flex flex-col justify-between group relative group ${cn} `}>
                {tweet.author._id === user?._id &&
                    <span className="absolute right-4 z-10 top-4 opacity-0 group-hover:opacity-100">
                        <AlertConfirmDialog
                            Icon={Trash}
                            iconColor="text-red-500"
                            title="Delete this tweet?"
                            description="This action cannot be undone. The tweet will be permanently removed."
                            confirmText="Delete"
                            cancelText="Cancel"
                            onConfirm={() => onDelete?.(tweet._id)} />
                    </span>}
                <CardContent className="space-y-2 overflow-hidden p-0">

                    <div className="flex justify-start mb-2 items-center space-x-2 ">
                        {/* @issue have a look */}
                        <img className="rounded-full w-10 h-10" draggable="false" src={tweet.author?.profilePicture || defaultAvatar} alt="profile Pic" />
                        <div className="flex flex-col items-start justify-center text-sm">
                            {/* @issue fix alignment of tag */}
                            <h2 className="font-semibold">{tweet.author?.firstName} {tweet.author?.lastName}
                                &nbsp;    {tweet.author?.role === "instructor" && <TooltipDemo Icon={BadgeTurkishLira} cn="text-blue-600" content="Instructor Tweet" />}
                            </h2>
                            <h4 className="text-muted-foreground text-xs">@{tweet.author?.userName}</h4>
                        </div>

                    </div>
                    <h2 className="text-lg line-clamp-2 ">{tweet.title}</h2>
                    {tweet?.image?.url && <img className="w-full aspect-auto rounded-xl" draggable="false" src={tweet?.image?.url} alt="tweet image" />}
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{tweet.content}</p>
                    {/* Links */}
                    <div className="flex flex-col text-xs gap-1 mt-2">
                        {tweet.classroom && (
                            <div className="flex items-center gap-2 hover:underline cursor-pointer">
                                <LinkIcon size={14} /> Classroom: {tweet.classroom}
                            </div>
                        )}
                    </div>
                </CardContent>
                {/* @todo   */}

                <CardFooter className="px-6 text-xs text-muted-foreground border-t border-border w-full pt-1 flex justify-between items-center ">
                    <p>
                        {tweet.timeStr} &#x2022; {tweet.dateStr} <span className="ml-2 text-sm text-blue-500">
                            {`#${tweet.type}`}
                        </span>
                    </p>
                    <div className="flex space-x-6">
                        <span className="pt-1" onClick={() => {
                            onLike?.(tweet._id)
                            setIsLiked(!isLiked)
                            // @remind
                        }}>
                            <TooltipDemo Icon={isLiked ? HeartMinus : HeartPlus} content={isLiked ? "unlike" : "like"} cn={`${isLiked ? "text-red-500 hover:text-gray-500" : "hover:text-red-600"}`} />
                        </span>
                        <span className="pt-1"
                            onClick={() => setRepostDialog(true)}
                        >
                            <TooltipDemo Icon={Repeat} content="repost" cn="hover:text-blue-600" />
                        </span>
                    </div>
                </CardFooter>
            </Card>
            {repostDialog && <TweetRepost open={repostDialog} setOpen={setRepostDialog} tweet={tweet} />
            }        </>
    );
}
