// import React, { useState } from "react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuPortal,
//   DropdownMenuSeparator,
//   DropdownMenuSub,
//   DropdownMenuSubContent,
//   DropdownMenuSubTrigger,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
// import { EllipsisVertical, Pin, PinOff, Globe, Lock, UserPlus, Users2, Trash, UsersRound, Archive, ArchiveRestore, Save } from "lucide-react";
// import type { INote } from "@/types/type";
// import { useAccessChange, useAddCollaborator, useArchiveToggle, useDeleteNote, usePinToggle, useRemoveCollaborator, useTrashToggle } from "@/tanStack/hooks/useNotes";
// import useAuth from "@/hooks/useAuth";

// interface NoteActionsDropdownProps {
//   note: INote;
// }

// const NoteActionsDropdown: React.FC<NoteActionsDropdownProps> = ({ note }) => {

//   const [showCollaboratorDialog, setShowCollaboratorDialog] = useState(false);
//   const [showRemoveCollabDialog, setShowRemoveCollabDialog] = useState(false);
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [email, setEmail] = useState("");
//   const [access, setAccess] = useState("view");
//   const [userId, setUserId] = useState("");
//   const { user } = useAuth();

//   // ---------- HANDLERS ----------
//   const changeAccess = useAccessChange();
//   const pinToggle = usePinToggle();
//   const archiveToggle = useArchiveToggle();
//   const trashToggle = useTrashToggle();
//   const deleteNote = useDeleteNote();
//   const addCollaborator = useAddCollaborator();
//   const removeCollaborator = useRemoveCollaborator();

//   const isOwner = user?._id === note.owner._id;


//   function handleAddCollaborator() {
//     addCollaborator.mutate({
//       noteId: note._id,
//       userEmail: email,
//       access
//     }, {
//       onSuccess: () => {
//         setShowCollaboratorDialog(false)
//       }
//     })
//   }

//   function handleRemoveCollaborator() {
//     removeCollaborator.mutate({
//       noteId: note._id,
//       userId: userId
//     },
//       {
//         onSuccess: () => {
//           setShowRemoveCollabDialog(false)
//         }
//       }
//     )
//   }


//   return (
//     <>
//       {/* Dropdown Trigger */}
//       <DropdownMenu modal={false}>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" size="icon-sm" aria-label="Note actions">
//             <EllipsisVertical className="h-4 w-4" />
//           </Button>
//         </DropdownMenuTrigger>

//         <DropdownMenuContent className="w-44" align="end">
//           <DropdownMenuGroup>
//             {note.status === "active" && (
//               <DropdownMenuItem onClick={() => pinToggle.mutate(note._id)}>
//                 {note.isPinned ? (
//                   <>
//                     <PinOff className="w-4 h-4 mr-2" /> Unpin
//                   </>
//                 ) : (
//                   <>
//                     <Pin className="w-4 h-4 mr-2" /> Pin
//                   </>
//                 )}
//               </DropdownMenuItem>
//             )}

//             {note.status !== "trashed" && isOwner && (
//               <>
//                 {/* Access Control */}
//                 <DropdownMenuItem onClick={() => changeAccess.mutate(note._id)}>
//                   {note.isPublic ? (
//                     <>
//                       <Lock className="w-4 h-4 mr-2" /> Private
//                     </>
//                   ) : (
//                     <>
//                       <Globe className="w-4 h-4 mr-2" /> Public
//                     </>
//                   )}
//                 </DropdownMenuItem>

//                 {/* Archive / Unarchive */}
//                 <DropdownMenuItem onClick={() => archiveToggle.mutate(note._id)}>
//                   {note.status === "archived" ? (
//                     <>
//                       <ArchiveRestore className="w-4 h-4 mr-2" /> Unarchive
//                     </>
//                   ) : (
//                     <>
//                       <Archive className="w-4 h-4 mr-2" /> Archive
//                     </>
//                   )}
//                 </DropdownMenuItem>

//                 {/* Collaborators */}
//                 <DropdownMenuSub>
//                   <DropdownMenuSubTrigger>
//                     <UsersRound className="w-4 h-4 mr-2" /> Collaborator
//                   </DropdownMenuSubTrigger>
//                   <DropdownMenuPortal>
//                     <DropdownMenuSubContent>
//                       <DropdownMenuItem onClick={() => setShowCollaboratorDialog(true)}>
//                         <UserPlus className="w-4 h-4 mr-2" /> Add Collaborator
//                       </DropdownMenuItem>
//                       <DropdownMenuItem onClick={() => setShowRemoveCollabDialog(true)}>
//                         <Users2 className="w-4 h-4 mr-2" /> Remove Collaborator
//                       </DropdownMenuItem>
//                     </DropdownMenuSubContent>
//                   </DropdownMenuPortal>
//                 </DropdownMenuSub>
//               </>
//             )}

//             {note.status === "trashed" && isOwner && (
//               <DropdownMenuItem
//                 onClick={() => {
//                   trashToggle.mutate(note._id)
//                   setShowDeleteDialog(false)
//                 }}
//               >

//                 <Save className="w-4 h-4 mr-2" /> Restore
//               </DropdownMenuItem>
//             )}

//             {isOwner && <>
//               <DropdownMenuSeparator />

//               <DropdownMenuItem
//                 className="text-red-600!"
//                 onClick={() => {
//                   deleteNote.mutate(note._id)
//                   setShowDeleteDialog(false)
//                 }}
//               >
//                 <Trash className="w-4 h-4 mr-2 text-red-600" /> Delete
//               </DropdownMenuItem>
//             </>
//             }
//           </DropdownMenuGroup>
//         </DropdownMenuContent>
//       </DropdownMenu>


//       {/* Add Collaborator Dialog */}
//       <Dialog open={showCollaboratorDialog} onOpenChange={setShowCollaboratorDialog}>
//         <DialogContent className="sm:max-w-[400px]">
//           <DialogHeader>
//             <DialogTitle>Add Collaborator</DialogTitle>
//             <DialogDescription>
//               Add a user by their Email and select permission type.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="py-4 space-y-3">
//             <Label>User Email</Label>
//             <Input
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter Email"
//             />
//             <Label>Access Type</Label>
//             <Select value={access} onValueChange={setAccess}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select access" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="view">View</SelectItem>
//                 <SelectItem value="edit">Edit</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <DialogFooter>
//             <DialogClose asChild>
//               <Button variant="outline">Cancel</Button>
//             </DialogClose>
//             <Button onClick={handleAddCollaborator}>Add</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Remove Collaborator Dialog */}
//       <Dialog open={showRemoveCollabDialog} onOpenChange={setShowRemoveCollabDialog}>
//         <DialogContent className="sm:max-w-[400px]">
//           <DialogHeader>
//             <DialogTitle>Remove Collaborator</DialogTitle>
//             <DialogDescription>
//               Enter collaborator Email to remove from this note.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="py-4 space-y-3">
//             <Label>Collaborator Email</Label>
//             <Input
//               value={userId}
//               onChange={(e) => setUserId(e.target.value)}
//               placeholder="Enter collaborator Email"
//             />
//           </div>
//           <DialogFooter>
//             <DialogClose asChild>
//               <Button variant="outline">Cancel</Button>
//             </DialogClose>
//             <Button onClick={handleRemoveCollaborator}>Remove</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Delete confirm Dialog */}
//       <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
//         <DialogContent className="sm:max-w-[450px] space-y-4">
//           <DialogHeader className="space-y-4" >
//             <DialogTitle className="font-bold ">Delete Note</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete this note? You can move it to trash or permanently delete it.
//             </DialogDescription>
//             <DialogDescription className="text-sm text-muted-foreground">
//               Once permanently deleted, this note cannot be recovered.
//             </DialogDescription>
//           </DialogHeader>

//           <DialogFooter className="flex justify-between gap-4 sm:justify-end">
//             <DialogClose asChild>
//               <Button variant="outline">Cancel</Button>
//             </DialogClose>
//             <Button
//               variant="default"
//               onClick={() => {
//                 trashToggle.mutate(note._id)
//                 setShowDeleteDialog(false)
//               }}
//             >
//               Move to Trash
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={() => {
//                 deleteNote.mutate(note._id)
//                 setShowDeleteDialog(false)
//               }}
//             >
//               Delete Permanently
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>


//     </>
//   );
// };

// export default NoteActionsDropdown;


// import React, { useState } from "react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuPortal,
//   DropdownMenuSeparator,
//   DropdownMenuSub,
//   DropdownMenuSubContent,
//   DropdownMenuSubTrigger,
//   DropdownMenuTrigger
// } from "@/components/ui/dropdown-menu";

// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle
// } from "@/components/ui/dialog";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// import {
//   EllipsisVertical,
//   Pin,
//   PinOff,
//   Globe,
//   Lock,
//   UserPlus,
//   Users2,
//   Trash,
//   UsersRound,
//   Archive,
//   ArchiveRestore,
//   Save
// } from "lucide-react";

// import type { INote } from "@/types/type";
// import {
//   useAccessChange,
//   useAddCollaborator,
//   useArchiveToggle,
//   useDeleteNote,
//   usePinToggle,
//   useRemoveCollaborator,
//   useTrashToggle
// } from "@/tanStack/hooks/useNotes";

// import useAuth from "@/hooks/useAuth";

// /* -----------------------------------------------------
//     Reusable Dialog Components
// ----------------------------------------------------- */

// const ConfirmDialog = ({ open, onOpenChange, title, description, actions }) => (
//   <Dialog open={open} onOpenChange={onOpenChange}>
//     <DialogContent className="sm:max-w-[420px] space-y-4">
//       <DialogHeader>
//         <DialogTitle>{title}</DialogTitle>
//         {description && <DialogDescription>{description}</DialogDescription>}
//       </DialogHeader>

//       <DialogFooter>
//         <DialogClose asChild>
//           <Button variant="outline">Cancel</Button>
//         </DialogClose>
//         {actions}
//       </DialogFooter>
//     </DialogContent>
//   </Dialog>
// );

// const CollaboratorDialog = ({
//   open,
//   onOpenChange,
//   title,
//   description,
//   fields,
//   onSubmit
// }) => (
//   <Dialog open={open} onOpenChange={onOpenChange}>
//     <DialogContent className="sm:max-w-[350px]">
//       <DialogHeader>
//         <DialogTitle>{title}</DialogTitle>
//         <DialogDescription>{description}</DialogDescription>
//       </DialogHeader>

//       <div className="py-4 space-y-3">{fields}</div>

//       <DialogFooter>
//         <DialogClose asChild>
//           <Button variant="outline">Cancel</Button>
//         </DialogClose>
//         <Button onClick={onSubmit}>Confirm</Button>
//       </DialogFooter>
//     </DialogContent>
//   </Dialog>
// );

// /* -----------------------------------------------------
//     Main Component
// ----------------------------------------------------- */

// const NoteActionsDropdown: React.FC<{ note: INote }> = ({ note }) => {
//   const { user } = useAuth();
//   const isOwner = user?._id === note.owner._id;

//   // Dialog management
//   const [dialog, setDialog] = useState({
//     addCollab: false,
//     removeCollab: false,
//     deleteConfirm: false
//   });

//   const [email, setEmail] = useState("");
//   const [access, setAccess] = useState("view");
//   const [userId, setUserId] = useState("");

//   // Hooks
//   const changeAccess = useAccessChange();
//   const pinToggle = usePinToggle();
//   const archiveToggle = useArchiveToggle();
//   const trashToggle = useTrashToggle();
//   const deleteNote = useDeleteNote();
//   const addCollaborator = useAddCollaborator();
//   const removeCollaborator = useRemoveCollaborator();

//   /* ------------------------- Handlers ------------------------- */
//   const handleAddCollaborator = () =>
//     addCollaborator.mutate(
//       { noteId: note._id, userEmail: email, access },
//       { onSuccess: () => setDialog({ ...dialog, addCollab: false }) }
//     );

//   const handleRemoveCollaborator = () =>
//     removeCollaborator.mutate(
//       { noteId: note._id, userId },
//       { onSuccess: () => setDialog({ ...dialog, removeCollab: false }) }
//     );

//   /* -------------------------------------------------------------
//         Render
//   ------------------------------------------------------------- */

//   return (
//     <>
//       {/* Dropdown Trigger */}
//       <DropdownMenu modal={false}>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" size="icon-sm" aria-label="Note actions">
//             <EllipsisVertical className="h-4 w-4" />
//           </Button>
//         </DropdownMenuTrigger>

//         <DropdownMenuContent className="w-44" align="end">
//           <DropdownMenuGroup>
//             {/* Pin / Unpin */}
//             {note.status === "active" && (
//               <DropdownMenuItem onClick={() => pinToggle.mutate(note._id)}>
//                 {note.isPinned ? (
//                   <>
//                     <PinOff className="w-4 h-4 mr-2" /> Unpin
//                   </>
//                 ) : (
//                   <>
//                     <Pin className="w-4 h-4 mr-2" /> Pin
//                   </>
//                 )}
//               </DropdownMenuItem>
//             )}

//             {/* Owner-only actions */}
//             {isOwner && note.status !== "trashed" && (
//               <>
//                 {/* Access Toggle */}
//                 <DropdownMenuItem onClick={() => changeAccess.mutate(note._id)}>
//                   {note.isPublic ? (
//                     <>
//                       <Lock className="w-4 h-4 mr-2" /> Private
//                     </>
//                   ) : (
//                     <>
//                       <Globe className="w-4 h-4 mr-2" /> Public
//                     </>
//                   )}
//                 </DropdownMenuItem>

//                 {/* Archive */}
//                 <DropdownMenuItem onClick={() => archiveToggle.mutate(note._id)}>
//                   {note.status === "archived" ? (
//                     <>
//                       <ArchiveRestore className="h-4 w-4 mr-2" /> Unarchive
//                     </>
//                   ) : (
//                     <>
//                       <Archive className="h-4 w-4 mr-2" /> Archive
//                     </>
//                   )}
//                 </DropdownMenuItem>

//                 {/* Collaborators */}
//                 <DropdownMenuSub>
//                   <DropdownMenuSubTrigger>
//                     <UsersRound className="h-4 w-4 mr-2" /> Collaborators
//                   </DropdownMenuSubTrigger>
//                   <DropdownMenuPortal>
//                     <DropdownMenuSubContent>
//                       <DropdownMenuItem onClick={() => setDialog({ ...dialog, addCollab: true })}>
//                         <UserPlus className="h-4 w-4 mr-2" /> Add
//                       </DropdownMenuItem>

//                       <DropdownMenuItem onClick={() => setDialog({ ...dialog, removeCollab: true })}>
//                         <Users2 className="h-4 w-4 mr-2" /> Remove
//                       </DropdownMenuItem>
//                     </DropdownMenuSubContent>
//                   </DropdownMenuPortal>
//                 </DropdownMenuSub>
//               </>
//             )}

//             {/* Restore from trash */}
//             {note.status === "trashed" && isOwner && (
//               <DropdownMenuItem onClick={() => trashToggle.mutate(note._id)}>
//                 <Save className="w-4 h-4 mr-2" /> Restore
//               </DropdownMenuItem>
//             )}

//             {/* Delete */}
//             {isOwner && (
//               <>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem
//                   className="text-red-600"
//                   onClick={() => setDialog({ ...dialog, deleteConfirm: true })}
//                 >
//                   <Trash className="w-4 h-4 mr-2 text-red-600" /> Delete
//                 </DropdownMenuItem>
//               </>
//             )}
//           </DropdownMenuGroup>
//         </DropdownMenuContent>
//       </DropdownMenu>

//       {/* Add Collaborator Dialog */}
//       <CollaboratorDialog
//         open={dialog.addCollab}
//         onOpenChange={(v) => setDialog({ ...dialog, addCollab: v })}
//         title="Add Collaborator"
//         description="Enter email and choose permission."
//         onSubmit={handleAddCollaborator}
//         fields={
//           <>
//             <Label>Email</Label>
//             <Input value={email} onChange={(e) => setEmail(e.target.value)} />

//             <Label>Access</Label>
//             <Select value={access} onValueChange={setAccess}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select access" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="view">View</SelectItem>
//                 <SelectItem value="edit">Edit</SelectItem>
//               </SelectContent>
//             </Select>
//           </>
//         }
//       />

//       {/* Remove Collaborator Dialog */}
//       <CollaboratorDialog
//         open={dialog.removeCollab}
//         onOpenChange={(v) => setDialog({ ...dialog, removeCollab: v })}
//         title="Remove Collaborator"
//         description="Enter collaborator email to remove."
//         onSubmit={handleRemoveCollaborator}
//         fields={
//           <>
//             <Label>Email</Label>
//             <Input value={userId} onChange={(e) => setUserId(e.target.value)} />
//           </>
//         }
//       />

//       {/* Delete Confirmation Dialog */}
//       <ConfirmDialog
//         open={dialog.deleteConfirm}
//         onOpenChange={(v) => setDialog({ ...dialog, deleteConfirm: v })}
//         title="Delete Note"
//         description="Are you sure? You can trash or permanently delete this note."
//         actions={
//           <>
//             <Button onClick={() => trashToggle.mutate(note._id)}>Move to Trash</Button>
//             <Button
//               variant="destructive"
//               onClick={() => deleteNote.mutate(note._id)}
//             >
//               Delete Permanently
//             </Button>
//           </>
//         }
//       />
//     </>
//   );
// };

// export default NoteActionsDropdown;


// /components/note-actions/NoteActionsDropdown.tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";


import AddCollaboratorDialog from "./dialogs/AddCollaboratorDialog";
import RemoveCollaboratorDialog from "./dialogs/RemoveCollaboratorDialog";
import DeleteDialog from "./dialogs/DeleteDialog";

import React, { useState } from "react";
import useAuth from "@/hooks/useAuth";
import useDialogState from "@/hooks/useDialogState";
import { useNoteActions } from "@/hooks/useNoteActions";
import { getNoteMenuConfig } from "@/menu/noteMenuConfig";
import type { INote } from "@/types/type";

export default function NoteActionsDropdown({ note }: { note: INote }) {
  const { user } = useAuth();
  const isOwner = user?._id === note.owner._id;

  const { dialogs, openDialog, closeDialog } = useDialogState();
  const actions = useNoteActions(note);

  // Local fields
  const [email, setEmail] = useState("");
  const [access, setAccess] = useState("view");
  const [userId, setUserId] = useState("");

  const menu = getNoteMenuConfig(note, isOwner, openDialog, actions);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuGroup>
            {menu.map((item) =>
              item.children ? (
                <DropdownMenuSub key={item.label}>
                  <DropdownMenuSubTrigger>
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </DropdownMenuSubTrigger>

                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {item.children.map((sub) => (
                        <DropdownMenuItem key={sub.label} onClick={sub.onClick}>
                          <sub.icon className="h-4 w-4 mr-2" />
                          {sub.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              ) : (
                <React.Fragment key={item.label}>
                  {item.variant === "danger" && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    onClick={item.onClick}
                    className={item.variant === "danger" ? "text-red-600" : ""}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </DropdownMenuItem>
                </React.Fragment>
              )
            )}

          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ---- dialogs ---- */}
      <AddCollaboratorDialog
        open={dialogs.addCollab}
        onClose={() => closeDialog("addCollab")}
        email={email}
        setEmail={setEmail}
        access={access}
        setAccess={setAccess}
        onSubmit={() => actions.addCollab.mutate({
          noteId: note._id,
          userEmail: email,
          access,
        })}
      />

      <RemoveCollaboratorDialog
        open={dialogs.removeCollab}
        onClose={() => closeDialog("removeCollab")}
        userId={userId}
        setUserId={setUserId}
        onSubmit={() => actions.removeCollab.mutate({
          noteId: note._id,
          userId,
        })}
      />

      <DeleteDialog
        open={dialogs.deleteConfirm}
        onClose={() => closeDialog("deleteConfirm")}
        onTrash={() => actions.trash.mutate(note._id)}
        onDelete={() => actions.deleteNote.mutate(note._id)}
      />
    </>
  );
}
