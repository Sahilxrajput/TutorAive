import API from "@/lib/api";
import type {
  INote,
  IAddCollaborator,
  IRemoveCollaborator,
} from "@/types/type";
import { toast } from "sonner";

export const fetchNotes = async (status: string | undefined) => {
  const { data } = await API.get("/notes/status/" + status);
  return data.data;
};

export const fetchNote = async (id: string) => {
  const { data } = await API.get(`/notes/${id}`);
  return data.data;
};

export async function saveNote(newNote: FormData) {
  const { data } = await API.post("/notes", newNote);
  console.log("data :", data);
  toast.success(data.message);
  return data.data;
}

export const updateNote = async ({
  noteId,
  payload,
}: {
  noteId: string;
  payload: FormData;
}) => {
  const { data } = await API.put(`/notes/${noteId}`, payload);
  toast.success(data.message);
  return data.data;
};

export const clearTrash = async () => {
  const { data } = await API.delete("/notes/clear-trash");
  toast.success(data.message);
};

export const changeAccess = async (id: string) => {
  const { data } = await API.patch<{ data: INote; message: string }>(
    `/notes/${id}/toggle-access`
  );
  toast.success(data.message);
  return data.data;
};

export const addCollaborator = async ({
  noteId,
  userEmail,
  access,
}: IAddCollaborator) => {
  const { data } = await API.post(`/notes/${noteId}/collaborators`, {
    userEmail,
    access,
  });
  toast.success(data.message);
  return data.data;
};

export const removeCollaborator = async ({
  noteId,
  userId,
}: IRemoveCollaborator) => {
  const { data } = await API.delete(
    `/notes/${noteId}/collaborators?userEmail=${userId}`
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
  const { data } = await API.patch<{ data: INote; message: string }>(
    `/notes/${id}/toggle-trash`
  );
  toast.success(data.message);
  return data.data;
};

export const togglePin = async (id: string) => {
  const { data } = await API.patch<{ data: INote; message: string }>(
    `/notes/${id}/toggle-pin`
  );
  toast.success(data.message);
  return data.data;
};

export const deleteNote = async (id: string) => {
  const { data } = await API.delete<{ data: INote; message: string }>(
    `/notes/${id}`
  );
  toast.success(data.message);
  return data.data;
};
