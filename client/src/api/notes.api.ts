import API from "@/lib/api";
import type { INote, ISaveNote } from "@/types/type";

interface IAddCollaborator {
  id: string;
  email: string;
  access: string;
}

interface IRemoveCollaborator {
  noteId: string;
  collabId: string;
}

export const fetchNotes = async (status: string | undefined) => {
  //@remind
  const { data } = await API.get("/notes" + status);
  return data.data;
};

export const fetchNote = async (id: string) => {
  const { data } = await API.get(`/notes/${id}`);
  return data.data;
};

export async function saveNote(newNote: ISaveNote) {
  await API.post("/notes", newNote);
}

export const clearTrash = async () => {
  await API.delete("/notes/clear-trash");
};

export const changeAccess = async (id: string) => {
  await API.patch(`/notes/${id}/toggle-visibility`);
};

export const addCollaborator = async ({
  id,
  email,
  access,
}: IAddCollaborator) => {
  await API.post(`/notes/${id}/collaborators`, {
    userEmail: email,
    access,
  });
};

export const removeCollaborator = async ({
  noteId,
  collabId,
}: IRemoveCollaborator) => {
  await API.delete(`/notes/${noteId}/collaborators?userEmail=${collabId}`);
};

export const toggleArchive = async (id: string) => {
  await API.patch(`/notes/${id}/toggle-archive`);
};

export const toggleTrash = async (id: string) => {
  await API.patch(`/notes/${id}/toggle-trash`);
};

export const deleteNote = async (id: string) => {
  await API.delete(`/notes/${id}`);
};
