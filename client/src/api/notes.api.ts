import API from "@/lib/api";
import type { ISaveNote } from "@/types/type";
import { toast } from "sonner";

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
  const { data } = await API.get("/notes/" + status);
  return data.data;
};

export const fetchNote = async (id: string) => {
  const { data } = await API.get(`/notes/${id}`);
  return data.data;
};

export async function saveNote(newNote: FormData) {
  const { data } = await API.post("/notes", newNote);
  console.log("data :", data.data)
  toast.success(data.message);
  return data.data;
}

export const clearTrash = async () => {
  const { data } = await API.delete("/notes/clear-trash");
  toast.success(data.message);
};

export const changeAccess = async (id: string) => {
  const { data } = await API.patch(`/notes/${id}/toggle-visibility`);
  toast.success(data.message);
};

export const addCollaborator = async ({
  id,
  email,
  access,
}: IAddCollaborator) => {
  const { data } = await API.post(`/notes/${id}/collaborators`, {
    userEmail: email,
    access,
  });
  toast.success(data.message);
  return data.data;
};

export const removeCollaborator = async ({
  noteId,
  collabId,
}: IRemoveCollaborator) => {
  const { data } = await API.delete(
    `/notes/${noteId}/collaborators?userEmail=${collabId}`
  );
  toast.success(data.message);
  return data.data;
};

export const toggleArchive = async (id: string) => {
  const { data } = await API.patch(`/notes/${id}/toggle-archive`);
  toast.success(data.message);
  return data.data;
};

export const toggleTrash = async (id: string) => {
  const { data } = await API.patch(`/notes/${id}/toggle-trash`);
  toast.success(data.message);
  return data.data;
};

export const togglePin = async (id: string) => {
  const { data } = await API.patch(`/notes/${id}/toggle-pin`);
  toast.success(data.message);
};

export const deleteNote = async (id: string) => {
  const { data } = await API.delete(`/notes/${id}`);
  toast.success(data.message);
};
