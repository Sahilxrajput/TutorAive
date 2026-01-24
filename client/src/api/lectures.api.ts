import API from "@/lib/api";
import type { ILecture } from "@/types/type";

export const fetchNotifications = async () => {
  const { data } = await API.get("/notifications");
  return data.data;
};

export const fetchLecturesForDay = async (day: string): Promise<ILecture[]> => {
  const res = await API.get(`/lectures?day=${day}`);
  return res.data;
};
