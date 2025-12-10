// /components/note-actions/hooks/useNoteActions.ts
import {
  useAccessChange,
  useAddCollaborator,
  useArchiveToggle,
  useDeleteNote,
  usePinToggle,
  useRemoveCollaborator,
  useTrashToggle,
} from "@/tanStack/hooks/useNotes";
import type { INote } from "@/types/type";

export const useNoteActions = (note: INote) => {
  const pin = usePinToggle();
  const archive = useArchiveToggle();
  const trash = useTrashToggle();
  const deleteNote = useDeleteNote();
  const changeAccess = useAccessChange();
  const addCollab = useAddCollaborator();
  const removeCollab = useRemoveCollaborator();

  return {
    pin,
    archive,
    trash,
    deleteNote,
    changeAccess,
    addCollab,
    removeCollab,
  };
};
