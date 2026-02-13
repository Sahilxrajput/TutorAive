import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { LucideIcon } from "lucide-react"

interface Props {
    Icon?: LucideIcon,
    content: string,
    cn?: string
}

export function TooltipDemo({ Icon, content, cn }: Props) {
    return (
        <Tooltip>
            <TooltipTrigger>
                {Icon && <Icon size={16} className={`aspect-square ${cn}`} />}
            </TooltipTrigger>
            <TooltipContent>
                <p>{content}</p>
            </TooltipContent>
        </Tooltip>
    )
}
