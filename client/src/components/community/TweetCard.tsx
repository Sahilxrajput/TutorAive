import { Card, CardContent } from "@/components/ui/card";
import { Trash, LinkIcon, Bell } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import type { ITweet } from "@/types/auth";
import { CardFooter } from "../tiptap-ui-primitive/card";
import { AlertConfirmDialog } from "../AlertConfirmDialog";

interface Props {
    tweet: ITweet;
    onDelete: (id: string) => void;
}

export default function TweetCard({ tweet, onDelete }: Props) {

    const { user } = useAuth();

    return (
        <Card className="shadow-sm hover:bg-muted/50 pb-4 transition px-6 flex flex-col justify-between group relative">
            {tweet.author._id === user?._id &&
                <span className="absolute right-4 z-10 top-4 ">
                    <AlertConfirmDialog
                        Icon={Trash}
                        iconColor="text-red-500"
                        title="Delete this tweet?"
                        description="This action cannot be undone. The tweet will be permanently removed."
                        confirmText="Delete"
                        cancelText="Cancel"
                        onConfirm={() => onDelete(tweet._id)} />
                </span>}
            <CardContent className="space-y-2 overflow-hidden p-0">

                <div className="flex justify-start mb-2 items-center space-x-2 ">
                    <div className="flex items-center justify-center rounded-full w-10 h-10">
                        <img className="rounded-full flex-1 object-cover" draggable="false" src={tweet.author?.profilePicture} alt="user profile picture" />
                    </div>
                    <div className="flex flex-col items-start justify-center text-sm">
                        <h2 className="font-semibold">{tweet.author?.firstName} {tweet.author?.lastName}</h2>
                        <h4 className="text-muted-foreground text-xs">@{tweet.author?.userName}</h4>
                    </div>
                </div>
                <h2 className="text-lg line-clamp-2 ">{tweet.title}</h2>
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
            <CardFooter className="px-6 text-xs text-muted-foreground border-t border-border pt-1 items-start ">
                {tweet.timeStr} &#x2022; {tweet.dateStr} <span className="ml-2 text-sm text-blue-500">
                    #{tweet.type}
                </span>
                {

                }
            </CardFooter>

        </Card>
    );
}
