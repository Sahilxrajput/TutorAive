import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Trash, Repeat, HeartPlus, HeartMinus } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import type { ITweet } from "@/types/type";
import { AlertConfirmDialog } from "../AlertConfirmDialog";
import { TooltipDemo } from "../TooltipDemo";
import { useEffect, useState } from "react";
import TweetCreateDialog from "./TweetCreate";
import AuthorInfo from "./AuthorInfo";
import { useDeleteTweet, useLikeTweet } from "@/tanStack/hooks/useTweets";
import { formatTime, formatDate } from "@/utils/splitDateTime";
import { toast } from "sonner";

interface Props {
    tweet: ITweet;
    isCreating?: boolean;
}

function TweetImage({ src }: { src: string }) {
    if (!src) return null;
    return (
        <img
            className="w-full aspect-auto rounded-xl"
            draggable="false"
            src={src}
            alt="tweet image"
        />
    );
}


export default function TweetCard({
    tweet,
    isCreating = false
}: Props) {
    const [isLiked, setIsLiked] = useState(false);
    const [repostDialog, setRepostDialog] = useState(false);
    const { user } = useAuth();
    const likeTweet = useLikeTweet();
    const deleteTweet = useDeleteTweet(tweet._id);

    useEffect(() => {
        if (user) {
            if (tweet.likes) setIsLiked(tweet.likes.includes(user._id));
        }
    }, [user, tweet.likes]);


    const handleLike = () => {
        if (!user) {
            toast.warning("User must be loged in")
            return
        }
        likeTweet.mutate(tweet._id)
    }

    const handleRepost = () => {
        if (!user) {
            toast.warning("User must be loged in")
            return
        }
        setRepostDialog(true);
    }

    return (
        <>
            <Card className="shadow-sm hover:bg-muted/50 pb-4 transition px-4 flex flex-col justify-between group relative">

                {/* DELETE BUTTON */}
                {tweet.author._id === user?._id && (
                    <span className="absolute right-4 z-10 top-4 opacity-0 group-hover:opacity-100">
                        <AlertConfirmDialog
                            Icon={Trash}
                            iconColor="text-red-500"
                            title="Delete this tweet?"
                            description="This action cannot be undone. The tweet will be permanently removed."
                            confirmText="Delete"
                            cancelText="Cancel"
                            onConfirm={() => deleteTweet.mutate()}
                        />
                    </span>
                )}

                <CardContent className="space-y-2 overflow-hidden p-0">
                    <AuthorInfo author={tweet.author} />
                    <p className="text-sm mb-2 text-muted-foreground whitespace-pre-wrap break-words">{tweet.content}</p>
                    {tweet.image && <TweetImage src={tweet.image.url} />}

                    {tweet.
                        parentTweet && (
                            <Card className="shadow-sm hover:bg-muted/50 p-4 mt-4 transition flex flex-col">
                                {/* //@fix */}
                                <AuthorInfo author={tweet.parentTweet.author} />
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                                    {tweet.parentTweet?.content}
                                </p>
                                {tweet.parentTweet?.image && <TweetImage src={tweet.parentTweet?.image?.url} />}
                            </Card>
                        )}

                </CardContent>

                {!isCreating && (
                    <CardFooter className="px-6 text-xs text-muted-foreground border-t border-border w-full pt-1 flex justify-between items-center">
                        <p>
                            {formatTime(tweet.createdAt!)} • {formatDate(tweet.createdAt!)}
                            <span className="ml-2 text-sm text-blue-500">{`#${tweet.type}`}</span>
                        </p>

                        <div className="flex space-x-6">
                            <span
                                className="pt-1"
                                onClick={handleLike}
                            >
                                <TooltipDemo
                                    Icon={isLiked ? HeartMinus : HeartPlus}
                                    content={isLiked ? "unlike" : "like"}
                                    cn={`${isLiked ? "text-red-500 hover:text-gray-500" : "hover:text-red-600"}`}
                                />
                            </span>

                            <span className="pt-1" onClick={handleRepost}>
                                <TooltipDemo Icon={Repeat} content="repost" cn="hover:text-blue-600" />
                            </span>
                        </div>
                    </CardFooter>
                )}

            </Card>

            {repostDialog && (
                <TweetCreateDialog
                    _id={tweet._id}
                    parentTweet={tweet}
                    isOpen={repostDialog}
                    setIsOpen={setRepostDialog}
                />
            )}
        </>
    );
}
