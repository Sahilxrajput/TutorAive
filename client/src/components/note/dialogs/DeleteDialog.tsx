// /components/note-actions/dialogs/DeleteDialog.tsx
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
    DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DeleteDialog({ open, onClose, onTrash, onDelete }) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="space-y-3">
                <DialogHeader>
                    <DialogTitle>Delete Note</DialogTitle>
                    <DialogDescription>
                        Move to trash or permanently delete?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={onTrash}>Move to Trash</Button>
                    <Button variant="destructive" onClick={onDelete}>
                        Delete Permanently
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
