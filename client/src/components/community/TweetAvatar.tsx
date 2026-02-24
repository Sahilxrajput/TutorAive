import { IUser } from '@/types/type'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface Props {
    author: IUser,
    size: number
}

const TweetAvatar = ({ author, size  }: Props) => {
    return (
        author?.profilePicture ? (
            <Avatar className={`w-${size} rounded-full h-${size}`}>
                <AvatarImage src={author.profilePicture} alt="U" />
                <AvatarFallback className={`w-${size} rounded-full h-${size} font-bold text-primary uppercase`}>
                    {author?.firstName?.charAt(0) || "U"}
                </AvatarFallback>
            </Avatar>
        ) : (
            <div className={`w-${size} rounded-full h-${size} rounded-full bg-primary/10 uppercase flex items-center justify-center font-bold text-primary`}>
                {author?.userName?.charAt(0) || "U"}
            </div>
        )
    )
}

export default TweetAvatar
