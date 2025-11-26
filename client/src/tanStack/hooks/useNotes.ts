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
} from "@/api/notes.api";
import type { INote, ISaveNote } from "@/types/type";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_NOTES } from "../constants";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";

export function useNotes(status: string | undefined) {
  return useQuery<INote[], Error>({
    queryKey: status ? [CACHE_KEY_NOTES, status] : CACHE_KEY_NOTES,
    queryFn: () => fetchNotes(status),
  });
}

export function useNote(id: string) {
  return useQuery<INote, Error>({
    queryKey: ["note", id],
    queryFn: () => fetchNote(id),
  });
}

export function useDeleteTweet(noteId: string) {
  const qc = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: () => deleteNote(noteId),
    onSuccess: () => {
      qc.setQueryData(CACHE_KEY_NOTES, (prev: INote[] = []) =>
        prev.filter((n) => n._id !== noteId)
      );
    },
    onError() {
      toast.error("Something goes Wrong");
    },
  });
}

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
          email:user?.email || ""
        },
        status: "active",
        visibility: "private",
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

export function useChangeAccess() {
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
                visibility: n.visibility === "private" ? "public" : "private",
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

export function useAddCollaborator() {
  const qc = useQueryClient();

  return useMutation<INote, Error, IAddCollaborator, { prevNotes: INote[] }>({
    mutationFn: (payload) => addCollaborator(payload),

    onMutate: async ({ id, email, access }) => {
      await qc.cancelQueries({ queryKey: CACHE_KEY_NOTES });

      const prevNotes = qc.getQueryData<INote[]>(CACHE_KEY_NOTES) ?? [];

      qc.setQueryData<INote[]>(CACHE_KEY_NOTES, (prev = []) =>
        prev.map((n) =>
          n._id === id
            ? {
                ...n,
                collaborators: [...(n.collaborators ?? []), { email, access }],
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

export function useRemoveCollaborator() {
  const qc = useQueryClient();

  return useMutation<INote, Error, IRemoveCollaborator, { prevNotes: INote[] }>(
    {
      mutationFn: (payload) => removeCollaborator(payload),

      onMutate: async ({ noteId, collabId }) => {
        await qc.cancelQueries({ queryKey: CACHE_KEY_NOTES });

        const prevNotes = qc.getQueryData<INote[]>(CACHE_KEY_NOTES) ?? [];

        qc.setQueryData<INote[]>(CACHE_KEY_NOTES, (prev = []) =>
          prev.map((n) =>
            n._id === noteId
              ? {
                  ...n,
                  collaborators: n.collaborators?.filter(
                    (c) => c.email !== collabId
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

export function useToggleArchive() {
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

export function useToggleTrash() {
  const qc = useQueryClient();

  return useMutation<INote, Error, string, { prevNotes: INote[] }>({
    mutationFn: (id) => toggleTrash(id),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: CACHE_KEY_NOTES });

      const prevNotes = qc.getQueryData<INote[]>(CACHE_KEY_NOTES) ?? [];

      qc.setQueryData<INote[]>(CACHE_KEY_NOTES, (prev = []) =>
        prev.map((n) =>
          n._id === id
            ? { ...n, status: n.status === "trash" ? "active" : "trash" }
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

export function useTogglePin() {
  const qc = useQueryClient();

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
                pinnedAt: note.pinnedAt ? null : new Date().toISOString(),
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
