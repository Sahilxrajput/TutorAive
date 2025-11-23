import type { ITweet } from "@/types/type";
import { BadgeTurkishLira } from "lucide-react";
import { TooltipDemo } from "../TooltipDemo";
import defaultAvatar from "@/assets/image/avatar.png";


export default function AuthorInfo({ author }: { author: ITweet["author"] }) {
    return (
        <div className="flex justify-start mb-2 items-center space-x-2">
            <img
                className="rounded-full w-10 h-10"
                draggable="false"
                src={author?.profilePicture || defaultAvatar}
                alt="profile Pic"
            />
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