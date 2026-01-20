import type { ITweet } from "@/types/type";
import { BadgeTurkishLira } from "lucide-react";
import { TooltipDemo } from "../TooltipDemo";
import defaultAvatar from "@/assets/image/avatar.png";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";


export default function AuthorInfo({ author }: { author: ITweet["author"] }) {
    const username = author?.userName ?? "User"
    return (
        <div className="flex justify-start mb-2 items-center space-x-2">
            <Avatar className="h-10 w-10 border rounded-full flex items-center justify-center">
                <AvatarImage className="rounded-full" src={author?.profilePicture ?? defaultAvatar} />
                <AvatarFallback>
                    {username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start justify-center text-sm">
                <h2 className="font-semibold">
                    {author?.firstName} {author?.lastName}
                    {author?.role === "instructor" && (
                        <TooltipDemo
                            Icon={BadgeTurkishLira}
                            cn="text-blue-600"
                            content="Instructor Tweet"
                        />
                    )}
                </h2>
                <h4 className="text-muted-foreground text-xs">@{author?.userName}</h4>
            </div>
        </div>
    );
}