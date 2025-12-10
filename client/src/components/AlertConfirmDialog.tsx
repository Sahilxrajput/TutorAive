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
    iconColor?: string
    title?: string
    description?: string
    confirmText?: string
    cancelText?: string
    onConfirm?: () => void
}

export function AlertConfirmDialog({
    Icon,
    iconColor = "text-red-500",
    title = "Are you absolutely sure?",
    description = "This action cannot be undone.",
    confirmText = "Continue",
    cancelText = "Cancel",
    onConfirm,
}: AlertConfirmDialogProps) {
    return (
        <AlertDialog  >
            <AlertDialogTrigger asChild>
                <Button variant="outline">{<Icon className={iconColor} />}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription  >{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>{confirmText}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
