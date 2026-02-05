import { ITweet } from '@/types/type'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface Props {
    author: ITweet["author"],
    size: number
}

const TweetAvatar = ({ author, size  }: Props) => {
    return (
        author?.profilePicture ? (
            <Avatar className={`w-${size} rounded-full h-${size}`}>
                <AvatarImage src={author.profilePicture} alt="U" />
                <AvatarFallback className="font-bold text-primary uppercase">
                    {author?.firstName?.charAt(0) || "U"}
                </AvatarFallback>
            </Avatar>
        ) : (
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-bold text-primary">
                {author?.userName?.charAt(0) || "U"}
            </div>
        )
    )
}

export default TweetAvatar
