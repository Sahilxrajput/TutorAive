import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import type { ComponentType } from "react"

interface Props {
    title?: string,
    Icon?: ComponentType<any>,
    content: string,
    cn?: string
}

export function TooltipDemo({ title, Icon, content, cn }: Props) {
    return (
        <Tooltip>
            <TooltipTrigger>
                {<Icon className={cn} />}
                {/* {title && <Button variant="outline" className={cn}>{title}</Button>} */}
                {/* {Icon && <Button variant="outline" className={cn}>{<Icon />}</Button>} */}
            </TooltipTrigger>
            <TooltipContent>
                <p>{content}</p>
            </TooltipContent>
        </Tooltip>
    )
}
