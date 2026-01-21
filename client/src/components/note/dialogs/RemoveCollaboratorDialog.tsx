import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
    DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Dispatch, SetStateAction } from "react";

interface Props {
    open: () => void
    onClose: () => void
    userId: string
    setUserId: Dispatch<SetStateAction<string>>
    onSubmit: () => void
}

export default function RemoveCollaboratorDialog({
    open,
    onClose,
    userId,
    setUserId,
    onSubmit,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Remove Collaborator</DialogTitle>
                    <DialogDescription>Enter collaborator email</DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-4">
                    <Label>Email</Label>
                    <Input value={userId} onChange={(e) => setUserId(e.target.value)} />
                </div>

                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={onSubmit}>Remove</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
