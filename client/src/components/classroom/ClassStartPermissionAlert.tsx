import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Video, Mic } from "lucide-react"
import { Dispatch, SetStateAction } from "react";

interface Props {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    onConfirm: () => void;
}


export function ClassStartPermissionAlert({ isOpen, setIsOpen, onConfirm }: Props) {
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Video className="w-6 h-6" />
                        <Mic className="w-6 h-6" />
                    </div>

                    <AlertDialogTitle>
                        Join Live Session
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        This session may use your camera and microphone for live interaction.
                        Please ensure your devices are connected and permissions are enabled.
                        You will be able to see and hear the live class once you continue.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction onClick={onConfirm}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
