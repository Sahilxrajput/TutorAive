import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Trash, Repeat, HeartPlus, HeartMinus } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import type { ITweet } from "@/types/type";
import { AlertConfirmDialog } from "../AlertConfirmDialog";
import { TooltipDemo } from "../TooltipDemo";
import { useState } from "react";
import TweetCreateDialog from "./TweetCreate";
import AuthorInfo from "./AuthorInfo";
import { useDeleteTweet, useLikeTweet } from "@/tanStack/hooks/useTweets";
import { formatTime, formatDate } from "@/utils/splitDateTime";
import { toast } from "sonner";

interface Props {
    tweet: ITweet;
    isCreating?: boolean;
}

function TweetImage({ src }: { src: string;}) {
    if (!src) return null;

    return (
        <img
            src={src}
            alt={`tweet image`}
            className="w-full rounded-xl object-contain max-h-[500px]"
            draggable={false}
        />
    );
}

export default function TweetCard({ tweet, isCreating = false }: Props) {
    const { user } = useAuth();
    const [repostDialog, setRepostDialog] = useState(false);

    const likeTweet = useLikeTweet();
    const deleteTweet = useDeleteTweet(tweet._id);

    const isLiked = !!user && tweet.likes?.includes(user._id);

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
        setRepostDialog(true);
    };

    return (
        <>
            <Card className="relative flex flex-col justify-between px-4 pb-4 transition shadow-sm hover:bg-muted/50 group">
                {/* DELETE */}
                {tweet.author._id === user?._id && (
                    <span className="absolute right-4 top-4 z-10 opacity-0 transition group-hover:opacity-100">
                        <AlertConfirmDialog
                            Icon={Trash}
                            iconColor="text-red-500"
                            title="Delete this tweet?"
                            description="This action cannot be undone."
                            confirmText="Delete"
                            cancelText="Cancel"
                            onConfirm={() =>
                                deleteTweet.mutate(undefined, {
                                    onSuccess: () => toast.success("Tweet deleted"),
                                    onError: () => toast.error("Failed to delete tweet"),
                                })
                            }
                        />
                    </span>
                )}

                <CardContent className="space-y-2 overflow-hidden p-0">
                    <AuthorInfo author={tweet.author} />

                    <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                        {tweet.content}
                    </p>

                    {tweet.image && (
                        <TweetImage
                            src={tweet.image.url}
                        />
                    )}

                    {/* REPOSTED TWEET */}
                    {tweet.parentTweet?.author && (
                        <Card className="mt-4 flex flex-col p-4 transition shadow-sm hover:bg-muted/50">
                            <AuthorInfo author={tweet.parentTweet.author} />

                            <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                                {tweet.parentTweet.content}
                            </p>

                            {tweet.parentTweet.image && (
                                <TweetImage
                                    src={tweet.parentTweet.image.url}
                                />
                            )}
                        </Card>
                    )}
                </CardContent>

                {!isCreating && (
                    <CardFooter className="flex w-full items-center justify-between border-t border-border px-6 pt-1 text-xs text-muted-foreground">
                        <p>
                            {formatTime(tweet.createdAt)} •{" "}
                            {formatDate(tweet.createdAt)}
                            <span className="ml-2 text-sm text-blue-500">
                                #{tweet.type}
                            </span>
                        </p>

                        <div className="flex space-x-6">
                            <span
                                className={`pt-1 ${likeTweet.isPending
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                    }`}
                                onClick={handleLike}
                            >
                                <TooltipDemo
                                    Icon={isLiked ? HeartMinus : HeartPlus}
                                    content={isLiked ? "Unlike" : "Like"}
                                    cn={
                                        isLiked
                                            ? "text-red-500 hover:text-gray-500"
                                            : "hover:text-red-600"
                                    }
                                />
                            </span>

                            <span className="pt-1" onClick={handleRepost}>
                                <TooltipDemo
                                    Icon={Repeat}
                                    content="Repost"
                                    cn="hover:text-blue-600"
                                />
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
