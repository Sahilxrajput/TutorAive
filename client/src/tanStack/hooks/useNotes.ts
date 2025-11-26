import {
  fetchNote,
  fetchNotes,
  saveNote,
  deleteNote,
  changeAccess,
  addCollaborator,
  removeCollaborator,
  toggleArchive,
  togglePin,
  toggleTrash,
  clearTrash,
  updateNote,
} from "@/api/notes.api";
import type { INote, ISaveNote, IAddCollaborator, IRemoveCollaborator } from "@/types/type";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_NOTES } from "../constants";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";


//@ok
export function useNotes(status: string | undefined) {
  return useQuery<INote[], Error>({
    queryKey: status ? [CACHE_KEY_NOTES, status] : CACHE_KEY_NOTES,
    queryFn: () => fetchNotes(status),
  });
}

//@ok
export function useNote(id: string) {
  return useQuery<INote, Error>({
    queryKey: ["note", id],
    queryFn: () => fetchNote(id),
  });
}

//@check
export function useDeleteNote() {
  const qc = useQueryClient();

  return useMutation<INote, Error, string, { prevNotes: INote[] }>({
    mutationFn: (id) => deleteNote(id),
    onSuccess: (deleted) => {
      qc.setQueryData(CACHE_KEY_NOTES, (prev: INote[] = []) =>
        prev.filter((n) => n._id !== deleted._id)
      );
    },
    onError() {
      toast.error("Something goes Wrong");
    },
  });
}
//@todo
export function useSaveNote() {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation<INote, Error, FormData, ISaveNote>({
    mutationFn: (formData) => saveNote(formData),

    onMutate: async (FormData) => {
      await qc.cancelQueries({
        queryKey: CACHE_KEY_NOTES, //@remind
      });

      const prevNotes = qc.getQueryData<INote[]>(CACHE_KEY_NOTES) ?? [];
      const content = FormData.get("content") as any;
      const title = FormData.get("title") as string;

      const optimisticNote: INote = {
        _id: "temp-" + Date.now(),
        content,
        title,
        owner: {
          userName: user?.userName || "",
          _id: user?._id || "",
          profilePicture: user?.profilePicture,
          email: user?.email || "",
        },
        pinnedBy:[],
        status: "active",
        collaborators:[],
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      qc.setQueryData<INote[]>(CACHE_KEY_NOTES, (prev = []) => [
        optimisticNote,
        ...prev,
      ]);

      return { prevNotes };
    },
    onSuccess: (savedNote) => {
      qc.setQueryData<INote[]>(CACHE_KEY_NOTES, (prev = []) => {
        return prev.map((note) =>
          note._id.startsWith("temp") ? savedNote : note
        );
      });
    },
    onError: (err, _vars, context) => {
      console.log(err);
      if (context?.prevNotes) {
        qc.setQueryData(CACHE_KEY_NOTES, context.prevNotes);
      }
      toast.error("Failed to save note.");
    },
  });
}

//@todo
export function useUpdateNote() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateNote,

    onSuccess: (updatedNote) => {
      // Update single note
      qc.setQueryData(["note", updatedNote._id], updatedNote);

      // Update list of notes
      qc.setQueryData<INote[]>(["notes"], (prev = []) =>
        prev.map((note) => (note._id === updatedNote._id ? updatedNote : note))
      );
    },
  });
}

//@todo
export function useClearTrash() {
  const qc = useQueryClient();

  return useMutation<void, Error, void, { prevNotes: INote[] }>({
    mutationFn: () => clearTrash(),

    onMutate: async () => {
      await qc.cancelQueries({ queryKey: CACHE_KEY_NOTES });

      const prevNotes = qc.getQueryData<INote[]>(CACHE_KEY_NOTES) ?? [];

      // optimistic: remove trash locally
      qc.setQueryData<INote[]>(CACHE_KEY_NOTES, (prev) =>
        prev?.filter((n) => n.status !== "trash")
      );

      return { prevNotes };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prevNotes) qc.setQueryData(CACHE_KEY_NOTES, ctx.prevNotes);
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CACHE_KEY_NOTES });
    },
  });
}

// @ok
export function useAccessChange() {
  const qc = useQueryClient();

  return useMutation<INote, Error, string, { prevNotes: INote[] }>({
    mutationFn: (id) => changeAccess(id),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: CACHE_KEY_NOTES });

      const prevNotes = qc.getQueryData<INote[]>(CACHE_KEY_NOTES) ?? [];

      qc.setQueryData<INote[]>(CACHE_KEY_NOTES, (prev = []) =>
        prev.map((n) =>
          n._id === id
            ? {
                ...n,
                isPublic: n.isPublic ? false : true,
              }
            : n
        )
      );

      return { prevNotes };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prevNotes) qc.setQueryData(CACHE_KEY_NOTES, ctx.prevNotes);
    },

    onSuccess: (updated) => {
      qc.setQueryData<INote[]>(CACHE_KEY_NOTES, (prev = []) =>
        prev.map((n) => (n._id === updated._id ? updated : n))
      );
    },
  });
}

// @ok
export function useAddCollaborator() {
  const qc = useQueryClient();

  return useMutation<INote, Error, IAddCollaborator, { prevNotes: INote[] }>({
    mutationFn: (payload) => addCollaborator(payload),

    onMutate: async ({ noteId, userEmail, access }) => {
      await qc.cancelQueries({ queryKey: CACHE_KEY_NOTES });

      const prevNotes = qc.getQueryData<INote[]>(CACHE_KEY_NOTES) ?? [];

      qc.setQueryData<INote[]>(CACHE_KEY_NOTES, (prev = []) =>
        prev.map((n) =>
          n._id === noteId
            ? {
                ...n,
                collaborators: [
                  ...(n.collaborators ?? []),
                  {
                    user: {
                      _id: "temp", // temporary placeholder until server returns real ID
                      userName: userEmail.split("@")[0], // fallback
                      email: userEmail,
                    },
                    access: access as "view" | "edit",
                  },
                ],
              }
            : n
        )
      );

      return { prevNotes };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prevNotes) qc.setQueryData(CACHE_KEY_NOTES, ctx.prevNotes);
    },

    onSuccess: (updated) => {
      qc.setQueryData<INote[]>(CACHE_KEY_NOTES, (prev = []) =>
        prev.map((n) => (n._id === updated._id ? updated : n))
      );
    },
  });
}

// @ok
export function useRemoveCollaborator() {
  const qc = useQueryClient();

  return useMutation<INote, Error, IRemoveCollaborator, { prevNotes: INote[] }>(
    {
      mutationFn: (payload) => removeCollaborator(payload),

      onMutate: async ({ noteId, userId }) => {
        await qc.cancelQueries({ queryKey: CACHE_KEY_NOTES });

        const prevNotes = qc.getQueryData<INote[]>(CACHE_KEY_NOTES) ?? [];

        qc.setQueryData<INote[]>(CACHE_KEY_NOTES, (prev = []) =>
          prev.map((n) =>
            n._id === noteId
              ? {
                  ...n,
                  collaborators: n.collaborators?.filter(
                    (c) => c.user.email !== userId
                  ),
                }
              : n
          )
        );

        return { prevNotes };
      },

      onError: (_err, _vars, ctx) => {
        if (ctx?.prevNotes) qc.setQueryData(CACHE_KEY_NOTES, ctx.prevNotes);
      },

      onSuccess: (updated) => {
        qc.setQueryData<INote[]>(CACHE_KEY_NOTES, (prev = []) =>
          prev.map((n) => (n._id === updated._id ? updated : n))
        );
      },
    }
  );
}

// @ok
export function useArchiveToggle() {
  const qc = useQueryClient();

  return useMutation<INote, Error, string, { prevNotes: INote[] }>({
    mutationFn: (id) => toggleArchive(id),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: CACHE_KEY_NOTES });

      const prevNotes = qc.getQueryData<INote[]>(CACHE_KEY_NOTES) ?? [];

      qc.setQueryData<INote[]>(CACHE_KEY_NOTES, (prev = []) =>
        prev.map((n) =>
          n._id === id
            ? { ...n, status: n.status === "archived" ? "active" : "archived" }
            : n
        )
      );

      return { prevNotes };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prevNotes) qc.setQueryData(CACHE_KEY_NOTES, ctx.prevNotes);
    },

    onSuccess: (updated) => {
      qc.setQueryData<INote[]>(CACHE_KEY_NOTES, (prev = []) =>
        prev.map((n) => (n._id === updated._id ? updated : n))
      );
    },
  });
}

// @ok
export function useTrashToggle() {
  const qc = useQueryClient();

  return useMutation<INote, Error, string, { prevNotes: INote[] }>({
    mutationFn: (id) => toggleTrash(id),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: CACHE_KEY_NOTES });

      const prevNotes = qc.getQueryData<INote[]>(CACHE_KEY_NOTES) ?? [];

      qc.setQueryData<INote[]>(CACHE_KEY_NOTES, (prev = []) =>
        prev.map((n) =>
          n._id === id
            ? { ...n, status: n.status === "trashed" ? "active" : "trashed" }
            : n
        )
      );

      return { prevNotes };
    },

    onError: (_e, _v, ctx) => {
      if (ctx?.prevNotes) qc.setQueryData(CACHE_KEY_NOTES, ctx.prevNotes);
    },

    onSuccess: (updated) => {
      qc.setQueryData<INote[]>(CACHE_KEY_NOTES, (prev = []) =>
        prev.map((n) => (n._id === updated._id ? updated : n))
      );
    },
  });
}

// @ok
export function usePinToggle() {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation<INote, Error, string, { prevNotes: INote[] }>({
    mutationFn: (id) => togglePin(id),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: CACHE_KEY_NOTES });

      const prevNotes = qc.getQueryData<INote[]>(CACHE_KEY_NOTES) ?? [];

      // optimistic update
      qc.setQueryData<INote[]>(CACHE_KEY_NOTES, (prev = []) =>
        prev.map((note) =>
          note._id === id
            ? {
                ...note,
                pinnedBy:
                  user?._id && note.pinnedBy.includes(user._id)
                    ? note.pinnedBy.filter((uid) => uid !== user._id)
                    : user?._id
                    ? [...note.pinnedBy, user._id]
                    : note.pinnedBy,
              }
            : note
        )
      );

      return { prevNotes };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prevNotes) qc.setQueryData(CACHE_KEY_NOTES, ctx.prevNotes);
    },

    onSuccess: (updatedNote) => {
      qc.setQueryData<INote[]>(CACHE_KEY_NOTES, (prev = []) =>
        prev.map((note) => (note._id === updatedNote._id ? updatedNote : note))
      );
    },
  });
}
