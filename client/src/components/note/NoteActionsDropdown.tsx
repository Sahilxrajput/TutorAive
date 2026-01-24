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
