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
import type { INote } from "@/types/auth";
import API from "@/api";
import { toast } from "sonner";

interface NoteActionsDropdownProps {
  note: INote;
  onActionComplete?: () => void;
}

const NoteActionsDropdown: React.FC<NoteActionsDropdownProps> = ({ note, onActionComplete }) => {

  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [showCollaboratorDialog, setShowCollaboratorDialog] = useState(false);
  const [showRemoveCollabDialog, setShowRemoveCollabDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [visibility, setVisibility] = useState(note.visibility);
  const [email, setEmail] = useState("");
  const [access, setAccess] = useState("view");
  const [collabId, setCollabId] = useState("");


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

  async function handleAddCollaborator() {
    try {
      const { data } = await API.post(`/notes/${note._id}/collaborators`, {
        userEmail: email,
        access,
      });
      console.log(data)
      toast.success(data.message);
      setShowCollaboratorDialog(false);
      setEmail("");
      onActionComplete?.();
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message || "Failed to add collaborator";
      toast.error(errorMessage);
    }
  }

  async function handleRemoveCollaborator() {
    try {
      const { data } = await API.delete(`/notes/${note._id}/collaborators?userEmail=${collabId}`);
      toast.success(data.message);
      console.log("remove", data)
      setShowRemoveCollabDialog(false);
      setCollabId("");
      onActionComplete?.();
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message || "Failed to remove collaborator";
      toast.error(errorMessage);
    }
  }

  async function handlePinToggle() {
    try {
      const { data } = await API.patch(`/notes/${note._id}/toggle-pin`);
      console.log(data)
      toast.success(data.message);
      onActionComplete?.();
    } catch {
      toast.error("Failed to toggle pin");
    }
  };

  async function handleTrash(permanent = false) {
    try {
      if (permanent) {
        const { data } = await API.delete(`/notes/${note._id}`);
        console.log("delete", data)
        toast.success(data.message);
      } else {
        const { data } = await API.patch(`/notes/${note._id}/toggle-trash`);
        console.log("trash", data)
        toast.info(data.message);
      }
      onActionComplete?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete note");
    }
  };

  async function handleArchiveToggle() {
    try {
      const { data } = await API.patch(`/notes/${note._id}/toggle-archive`);
      toast.success(data.message);
      onActionComplete?.();
    } catch {
      toast.error("Failed to archive/unarchive note");
    }
  };


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
              <DropdownMenuItem onClick={() => handlePinToggle()}>
                {note.pinnedAt ? (
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
                <DropdownMenuItem onClick={() => handleAccessChange()}>
                  {visibility === "private" ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" /> Private
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4 mr-2" />
                      {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
                    </>
                  )}
                </DropdownMenuItem>

                {/* Archive / Unarchive */}
                <DropdownMenuItem onClick={() => handleArchiveToggle()}>
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
              <DropdownMenuItem onClick={() => handleTrash()}>

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
              value={collabId}
              onChange={(e) => setCollabId(e.target.value)}
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
              onClick={() => handleTrash()}
            >
              Move to Trash
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleTrash(true)}
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
