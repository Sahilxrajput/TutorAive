// /components/note-actions/hooks/useDialogState.ts
import { useState } from "react";

type DialogKeys = "addCollab" | "removeCollab" | "deleteConfirm";

export default function useDialogState() {
  const [dialogs, setDialogs] = useState<Record<DialogKeys, boolean>>({
    addCollab: false,
    removeCollab: false,
    deleteConfirm: false,
  });

  const openDialog = (key: DialogKeys) =>
    setDialogs((d) => ({ ...d, [key]: true }));

  const closeDialog = (key: DialogKeys) =>
    setDialogs((d) => ({ ...d, [key]: false }));

  return { dialogs, openDialog, closeDialog };
}
