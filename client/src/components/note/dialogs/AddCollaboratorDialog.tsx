// /components/note-actions/dialogs/AddCollaboratorDialog.tsx
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
    DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { Dispatch, SetStateAction } from "react";


interface Props {
    open: boolean,
    onClose: () => void,
    email: string,
    setEmail: Dispatch<SetStateAction<string>>,
    access: string,
    setAccess: Dispatch<SetStateAction<string>>,
    onSubmit: () => void,
}


export default function AddCollaboratorDialog({
    open,
    onClose,
    email,
    setEmail,
    access,
    setAccess,
    onSubmit,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Collaborator</DialogTitle>
                    <DialogDescription>Enter email & access level.</DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-4">
                    <Label>Email</Label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} />

                    <Label>Access</Label>
                    <Select value={access} onValueChange={setAccess}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select access" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="view">View</SelectItem>
                            <SelectItem value="edit">Edit</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={onSubmit}>Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
