import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { EllipsisVertical, Pin, PinOff, Globe, Lock, UserPlus, Users2, Trash, UsersRound, Archive, ArchiveRestore, Save } from "lucide-react";
import type { INote } from "@/types/type";
import API from "@/lib/api";
import { toast } from "sonner";
import { useAccessChange, useAddCollaborator, useArchiveToggle, useDeleteNote, usePinToggle, useRemoveCollaborator, useTrashToggle } from "@/tanStack/hooks/useNotes";

interface NoteActionsDropdownProps {
  note: INote;
  onActionComplete?: () => void;
}

const NoteActionsDropdown: React.FC<NoteActionsDropdownProps> = ({ note, onActionComplete }) => {

  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [showCollaboratorDialog, setShowCollaboratorDialog] = useState(false);
  const [showRemoveCollabDialog, setShowRemoveCollabDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [access, setAccess] = useState("view");
  const [userId, setUserId] = useState("");


  // ---------- HANDLERS ----------
  async function handleAccessChange() {
    try {
      const { data } = await API.patch(`/notes/${note._id}/toggle-visibility`);
      setShowAccessDialog(false);
      toast.success(data.message);
      onActionComplete?.();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update access";
      toast.error(errorMessage);
    }
  }

  const changeAccess = useAccessChange();
  const pinToggle = usePinToggle();
  const archiveToggle = useArchiveToggle();
  const trashToggle = useTrashToggle();
  const deleteNote = useDeleteNote();
  const addCollaborator = useAddCollaborator();
  const removeCollaborator = useRemoveCollaborator();

  
  function handleAddCollaborator() {
    addCollaborator.mutate({
      noteId: note._id,
      userEmail: email,
      access
    })
  }

  function handleRemoveCollaborator() {
      removeCollaborator.mutate({
      noteId: note._id,
      userId: userId
    })
  }


  return (
    <>
      {/* Dropdown Trigger */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Note actions">
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-44" align="end">
          <DropdownMenuGroup>
            {note.status === "active" && (
              <DropdownMenuItem onClick={() => pinToggle.mutate(note._id)}>
                {note.isPinned ? (
                  <>
                    <PinOff className="w-4 h-4 mr-2" /> Unpin
                  </>
                ) : (
                  <>
                    <Pin className="w-4 h-4 mr-2" /> Pin
                  </>
                )}
              </DropdownMenuItem>
            )}

            {note.status !== "trashed" && (
              <>
                {/* Access Control */}
                <DropdownMenuItem onClick={() => changeAccess.mutate(note._id)}>
                  {note.isPublic ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" /> Private
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4 mr-2" /> Public
                    </>
                  )}
                </DropdownMenuItem>

                {/* Archive / Unarchive */}
                <DropdownMenuItem onClick={() => archiveToggle.mutate(note._id)}>
                  {note.status === "archived" ? (
                    <>
                      <ArchiveRestore className="w-4 h-4 mr-2" /> Unarchive
                    </>
                  ) : (
                    <>
                      <Archive className="w-4 h-4 mr-2" /> Archive
                    </>
                  )}
                </DropdownMenuItem>

                {/* Collaborators */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <UsersRound className="w-4 h-4 mr-2" /> Collaborator
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setShowCollaboratorDialog(true)}>
                        <UserPlus className="w-4 h-4 mr-2" /> Add Collaborator
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowRemoveCollabDialog(true)}>
                        <Users2 className="w-4 h-4 mr-2" /> Remove Collaborator
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </>
            )}

            {note.status === "trashed" && (
              <DropdownMenuItem>

                <Save className="w-4 h-4 mr-2" /> Restore
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600!">
              <Trash className="w-4 h-4 mr-2 text-red-600" /> Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Access Dialog */}
      {/* <Dialog open={showAccessDialog} onOpenChange={setShowAccessDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Change Access</DialogTitle>
            <DialogDescription>Choose who can view or edit this note.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <Label>Visibility</Label>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={() => handleAccessChange(note)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      {/* Add Collaborator Dialog */}
      <Dialog open={showCollaboratorDialog} onOpenChange={setShowCollaboratorDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add Collaborator</DialogTitle>
            <DialogDescription>
              Add a user by their Email and select permission type.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <Label>User Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
            />
            <Label>Access Type</Label>
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
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddCollaborator}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Collaborator Dialog */}
      <Dialog open={showRemoveCollabDialog} onOpenChange={setShowRemoveCollabDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Remove Collaborator</DialogTitle>
            <DialogDescription>
              Enter collaborator Email to remove from this note.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <Label>Collaborator Email</Label>
            <Input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter collaborator Email"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleRemoveCollaborator}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? You can move it to trash or permanently delete it.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Once permanently deleted, this note cannot be recovered.
            </p>
          </div>

          <DialogFooter className="flex justify-between gap-2 sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="outline"
              onClick={() => trashToggle.mutate(note._id)}
            >
              Move to Trash
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteNote.mutate(note._id)}
            >
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </>
  );
};

export default NoteActionsDropdown;
