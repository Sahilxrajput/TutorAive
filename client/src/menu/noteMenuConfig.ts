import type { INote } from "@/types/type";
import {
    Pin,
    PinOff,
    Globe,
    Lock,
    Archive,
    ArchiveRestore,
    UsersRound,
  UserPlus,
  Users2,
  Trash,
  Save,
  type LucideIcon,
} from "lucide-react";


interface MenuItem {
  label: string;
  icon: LucideIcon; 
  onClick?: () => void;
  variant?: "danger";
  children?: MenuItem[];
}


type DialogKeys = "addCollab" | "removeCollab" | "deleteConfirm";
interface NoteActions {
    pin: { mutate: (id: string) => void };
    changeAccess: { mutate: (id: string) => void };
    archive: { mutate: (id: string) => void };
    trash: { mutate: (id: string) => void };
}

export const getNoteMenuConfig = (
  note: INote,
  isOwner: boolean,
  openDialog: (key: DialogKeys) => void,
  actions: NoteActions,
) => {
  const { pin, changeAccess, archive, trash } = actions;

  return [
    // PIN
    note.status === "active" && {
      label: note.isPinned ? "Unpin" : "Pin",
      icon: note.isPinned ? PinOff : Pin,
      onClick: () => pin.mutate(note._id),
    },

    // PUBLIC / PRIVATE
    isOwner &&
      note.status !== "trashed" && {
        label: note.isPublic ? "Make Private" : "Make Public",
        icon: note.isPublic ? Lock : Globe,
        onClick: () => changeAccess.mutate(note._id),
      },

    // ARCHIVE
    isOwner &&
      note.status !== "trashed" && {
        label: note.status === "archived" ? "Unarchive" : "Archive",
        icon: note.status === "archived" ? ArchiveRestore : Archive,
        onClick: () => archive.mutate(note._id),
      },

    // COLLAB SUBMENU
    isOwner &&
      note.status !== "trashed" && {
        label: "Collaborators",
        icon: UsersRound,
        children: [
          {
            label: "Add Collaborator",
            icon: UserPlus,
            onClick: () => openDialog("addCollab"),
          },
          {
            label: "Remove Collaborator",
            icon: Users2,
            onClick: () => openDialog("removeCollab"),
          },
        ],
      },

    // RESTORE FROM TRASH
    note.status === "trashed" &&
      isOwner && {
        label: "Restore",
        icon: Save,
        onClick: () => trash.mutate(note._id),
      },

    // DELETE
    isOwner && {
      label: "Delete",
      icon: Trash,
      variant: "danger",
      onClick: () => openDialog("deleteConfirm"),
    },
  ].filter(Boolean) as MenuItem[];

};
