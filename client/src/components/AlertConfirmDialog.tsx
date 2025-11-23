import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import type { ComponentType } from "react"

export interface AlertConfirmDialogProps {
    Icon: ComponentType<any>
    title?: string
    cn?: string
    description?: string
    iconColor?: string
    confirmText?: string
    cancelText?: string
    onConfirm?: () => void
    open?: boolean
    onOpenChange?: (val: boolean) => void
}

export function AlertConfirmDialog({
    Icon,
    iconColor = "text-red-500",
    title = "Are you absolutely sure?",
    description = "This action cannot be undone.",
    confirmText = "Continue",
    cancelText = "Cancel",
    onConfirm,
    open,
    onOpenChange,
    cn
}: AlertConfirmDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {!onOpenChange && <AlertDialogTrigger asChild>
                <Button variant="outline">{<Icon className={iconColor} />}</Button>
            </AlertDialogTrigger>}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription className={`${cn}`} >{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>{confirmText}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
