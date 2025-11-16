import { Card, CardContent } from "@/components/ui/card";
import { Trash, LinkIcon, Bell, TicketX, BadgeTurkishLira, Heart, Repeat } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import type { ITweet } from "@/types/auth";
import { CardFooter } from "../tiptap-ui-primitive/card";
import { AlertConfirmDialog } from "../AlertConfirmDialog";
import { TooltipDemo } from "../TooltipDemo";
import defaultAvatar from "@/assets/image/avatar.png";
import { useEffect } from "react";

interface Props {
    tweet: ITweet;
    onDelete: (id: string) => void;
}

export default function TweetCard({ tweet, onDelete }: Props) {

    const { user } = useAuth();

    return (
        <Card className="shadow-sm hover:bg-muted/50 pb-4 transition px-6 flex flex-col justify-between group relative group">
            {tweet.author._id === user?._id &&
                <span className="absolute right-4 z-10 top-4 opacity-0 group-hover:opacity-100">
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
                    {/* @issue  */}
                    <img className="rounded-full w-10 h-10" draggable="false" src={tweet.author?.profilePicture} alt="profile Pic" />
                    <div className="flex flex-col items-start justify-center text-sm">
                        {/* @issue fix alignment of tag */}
                        <h2 className="font-semibold">{tweet.author?.firstName} {tweet.author?.lastName}
                            &nbsp;    {tweet.author?.role === "instructor" && <TooltipDemo Icon={BadgeTurkishLira} cn="text-blue-600 w-4 h-4" content="Instructor Tweet" />}
                        </h2>
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
            {/* @todo   */}
            {/* <CardContent className="flex gap-2">
                <Heart size={12} />
                <Repeat size={12}/>
            </CardContent> */}
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
