import { Card, CardContent } from "@/components/ui/card";
import { Trash, BadgeTurkishLira, Repeat, HeartPlus, HeartMinus } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import type { ITweet } from "@/types/auth";
import { CardFooter } from "../tiptap-ui-primitive/card";
import { AlertConfirmDialog } from "../AlertConfirmDialog";
import { TooltipDemo } from "../TooltipDemo";
import defaultAvatar from "@/assets/image/avatar.png";
import { useEffect, useState } from "react";
import TweetCreateDialog from "./TweetCreate";
import AuthorInfo from "./AuthorInfo";

interface Props {
    tweet: ITweet;
    isRepost?: boolean;
    isCreating?: boolean;
    onDelete?: (id: string) => void;
    onLike?: (id: string) => void;
}

// export default function TweetCard({ tweet, onDelete, onLike, isRepost = false, isCreating = false}: Props) {

//     const [isLiked, setIsLiked] = useState(false)
//     const [repostDialog, setRepostDialog] = useState(false)
//     const { user } = useAuth();

//     useEffect(() => {
//         if (user) {
//             setIsLiked(tweet.likes.includes(user._id));
//         }
//     }, [user, tweet]);

//     useEffect(() => {
//         console.log(isRepost)
//     }, [])

//     return (
//         <>
//             <Card className={`shadow-sm hover:bg-muted/50 pb-4 transition px-4 flex flex-col justify-between group relative`}>
//                 {(tweet.author._id === user?._id && !isRepost) &&
//                     <span className="absolute right-4 z-10 top-4 opacity-0 group-hover:opacity-100">
//                         <AlertConfirmDialog
//                             Icon={Trash}
//                             iconColor="text-red-500"
//                             title="Delete this tweet?"
//                             description="This action cannot be undone. The tweet will be permanently removed."
//                             confirmText="Delete"
//                             cancelText="Cancel"
//                             onConfirm={() => onDelete?.(tweet._id)} />
//                     </span>}
//                 <CardContent className="space-y-2 overflow-hidden p-0">
//                     <div>

//                         <div className="flex justify-start mb-2 items-center space-x-2 ">
//                             {/* @issue have a look */}
//                             <img className="rounded-full w-10 h-10" draggable="false" src={tweet.author?.profilePicture || defaultAvatar} alt="profile Pic" />
//                             <div className="flex flex-col items-start justify-center text-sm">
//                                 {/* @issue fix alignment of tag */}
//                                 <h2 className="font-semibold">{tweet.author?.firstName} {tweet.author?.lastName}
//                                     &nbsp;    {tweet.author?.role === "instructor" && <TooltipDemo Icon={BadgeTurkishLira} cn="text-blue-600" content="Instructor Tweet" />}
//                                 </h2>
//                                 <h4 className="text-muted-foreground text-xs">@{tweet.author?.userName}</h4>
//                             </div>
//                         </div>

//                         <p className="text-sm mb-2 text-muted-foreground whitespace-pre-wrap break-words">{tweet.content}</p>
//                         {tweet?.image?.url && <img className="w-full aspect-auto rounded-xl" draggable="false" src={tweet?.image?.url} alt="tweet image" />}

//                         {/* repost tweet */}
//                         {isRepost && <Card className={"shadow-sm hover:bg-muted/50 p-4 mt-4 transition flex flex-col justify-start group relative gap-4"}>
//                             <div className="flex justify-start items-center space-x-2">
//                                 <img className="rounded-full w-8 aspect-square" draggable="false" src={tweet.parentTweet?.author?.profilePicture || defaultAvatar} alt="profile Pic" />
//                                 <div className="flex flex-col items-start justify-center text-xs">
//                                     <h2 className="font-semibold">{tweet.parentTweet?.author?.firstName} {tweet.parentTweet?.author?.lastName}
//                                         &nbsp;    {tweet.parentTweet?.author?.role === "instructor" && <TooltipDemo Icon={BadgeTurkishLira} cn="text-blue-600" content="Instructor Tweet" />}
//                                     </h2>
//                                     <h4 className="text-muted-foreground text-xs">@{tweet.parentTweet?.author?.userName}</h4>
//                                 </div>
//                             </div>
//                             <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{tweet.parentTweet?.content}</p>
//                             {tweet.parentTweet?.image?.url && <img className="w-full aspect-auto rounded-xl" draggable="false" src={tweet.parentTweet?.image?.url} alt="tweet image" />}
//                         </Card>}


//                     </div>



//                 </CardContent>

//                 {!isCreating && <CardFooter className="px-6 text-xs text-muted-foreground border-t border-border w-full pt-1 flex justify-between items-center ">
//                     <p>
//                         {tweet.timeStr} &#x2022; {tweet.dateStr} <span className="ml-2 text-sm text-blue-500">
//                             {`#${tweet.type}`}
//                         </span>
//                     </p>
//                     <div className="flex space-x-6">
//                         <span className="pt-1" onClick={() => {
//                             onLike?.(tweet._id)
//                             setIsLiked(!isLiked)
//                             // @remind
//                         }}>

//                             <TooltipDemo Icon={isLiked ? HeartMinus : HeartPlus} content={isLiked ? "unlike" : "like"} cn={`${isLiked ? "text-red-500 hover:text-gray-500" : "hover:text-red-600"}`} />

//                         </span>
//                         <span className="pt-1"
//                             onClick={() => setRepostDialog(true)}
//                         >
//                             <TooltipDemo Icon={Repeat} content="repost" cn="hover:text-blue-600" />
//                         </span>
//                     </div>
//                 </CardFooter>}
//             </Card>
//             {repostDialog && <TweetCreateDialog parentTweet={tweet} isOpen={repostDialog} setIsOpen={setRepostDialog} />}

//         </>
//     );
// }




function TweetImage({ src }) {
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
    onDelete,
    onLike,
    isRepost = false,
    isCreating = false
}: Props) {

    const [isLiked, setIsLiked] = useState(false);
    const [repostDialog, setRepostDialog] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            setIsLiked(tweet.likes.includes(user._id));
        }
    }, [user, tweet.likes]);

    return (
        <>
            <Card className="shadow-sm hover:bg-muted/50 pb-4 transition px-4 flex flex-col justify-between group relative">

                {/* DELETE BUTTON */}
                {tweet.author._id === user?._id && !isCreating && (
                    <span className="absolute right-4 z-10 top-4 opacity-0 group-hover:opacity-100">
                        <AlertConfirmDialog
                            Icon={Trash}
                            iconColor="text-red-500"
                            title="Delete this tweet?"
                            description="This action cannot be undone. The tweet will be permanently removed."
                            confirmText="Delete"
                            cancelText="Cancel"
                            onConfirm={() => onDelete?.(tweet._id)}
                        />
                    </span>
                )}

                <CardContent className="space-y-2 overflow-hidden p-0">
                    <AuthorInfo author={tweet.author} />
                    <p className="text-sm mb-2 text-muted-foreground whitespace-pre-wrap break-words">{tweet.content}</p>
                    <TweetImage src={tweet.image?.url} />

                    {isRepost && (
                        <Card className="shadow-sm hover:bg-muted/50 p-4 mt-4 transition flex flex-col">
                            <AuthorInfo author={tweet.parentTweet?.author} />
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                                {tweet.parentTweet?.content}
                            </p>
                            <TweetImage src={tweet.parentTweet?.image?.url} />
                        </Card>
                    )}

                </CardContent>

                {!isCreating && (
                    <CardFooter className="px-6 text-xs text-muted-foreground border-t border-border w-full pt-1 flex justify-between items-center">
                        <p>
                            {tweet.timeStr} • {tweet.dateStr}
                            <span className="ml-2 text-sm text-blue-500">{`#${tweet.type}`}</span>
                        </p>

                        <div className="flex space-x-6">
                            <span
                                className="pt-1"
                                onClick={() => {
                                    onLike?.(tweet._id);
                                    setIsLiked(prev => !prev);
                                }}
                            >
                                <TooltipDemo
                                    Icon={isLiked ? HeartMinus : HeartPlus}
                                    content={isLiked ? "unlike" : "like"}
                                    cn={`${isLiked ? "text-red-500 hover:text-gray-500" : "hover:text-red-600"}`}
                                />
                            </span>

                            <span className="pt-1" onClick={() => setRepostDialog(true)}>
                                <TooltipDemo Icon={Repeat} content="repost" cn="hover:text-blue-600" />
                            </span>
                        </div>
                    </CardFooter>
                )}
            </Card>

            {repostDialog && (
                <TweetCreateDialog
                    parentTweet={tweet}
                    isOpen={repostDialog}
                    setIsOpen={setRepostDialog}
                />
            )}
        </>
    );
}
