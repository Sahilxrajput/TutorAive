import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import type { ComponentType } from "react"

interface Props {
    Icon?: ComponentType<any>,
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
