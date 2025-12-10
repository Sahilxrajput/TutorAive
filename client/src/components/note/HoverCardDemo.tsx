import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import type { INote } from "@/types/type"
import defaultAvtar from "@/assets/image/avatar.png"


interface Props {
    u: INote["owner"],
    i: number
}


export function HoverCardDemo({ u, i }: Props) {
    return (
        <HoverCard>
            <HoverCardTrigger>
                <div
                    key={u?._id || i}
                    className="relative"
                    style={{
                        marginLeft: i === 0 ? 0 : -30,
                        zIndex: i
                    }}
                >
                    <Avatar className="w-16 h-16 border-2 border-white shadow-md">
                        <AvatarImage src={u?.profilePicture || defaultAvtar} />
                        <AvatarFallback>{u?.userName?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-60">
                <div className="flex justify-between ">
                    <Avatar>
                        <AvatarImage src={u?.profilePicture || defaultAvtar} />
                        <AvatarFallback>{u?.userName?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold">{u.firstName + " " + u.lastName}</h4>
                        <p className="text-sm">
                            {u.email}
                        </p>
                        <div className="text-muted-foreground text-xs">
                            {"@" + u.userName}
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}
