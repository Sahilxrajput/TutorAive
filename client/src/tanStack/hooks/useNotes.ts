import { fetchNote, fetchNotes, saveNote } from "@/api/notes.api";
import type { INote, ISaveNote } from "@/types/type";
import { useQuery, useMutation } from "@tanstack/react-query";

export function useNotes(status: string | undefined) {
  useQuery<INote[], Error>({
    queryKey: status ? ["notes", status] : ["notes"],
    queryFn: () => fetchNotes(status),
  });
}

export function useNote(id: string) {
  return useQuery<INote, Error>({
    queryKey: ["note", id],
    queryFn: () => fetchNote(id),
  });
}

// export function useSaveNote(newNote: ISaveNote) {
//   return useMutation<ISaveNote, Error, ISaveNote>({
//     mutationFn: saveNote(newNote),
//   });
// }
