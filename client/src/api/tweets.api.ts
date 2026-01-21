import API from "@/lib/api";
import type {  ITweet,  } from "@/types/type";
import { toast } from "sonner";


export const fetchTweets = async ({ pageParam }: { pageParam?: string }) => {
  const { data } = await API.get("/tweets", {
    params: {
      limit: 12,
      before: pageParam, // cursor
    },
  });
  console.log("tweet dtaa: ", data)
  return data
};

export const fetchNotifications = async () => {
  const { data } = await API.get("/notifications");
  return data.data;
};

export const createTweet = async (payload: FormData) => {
  const { data } = await API.post<{ data: ITweet; message: string }>(
    "/tweets",
    payload
  );
  console.log("fire")
  console.log("create post: ", data)
  toast.success(data.message);
  return data.data;
};

export const createRepost = async (payload: FormData) => {
  const { data } = await API.post<{ data: ITweet; message: string }>(
    `/tweets/${payload.get("parentTweetId")}/repost`,
    {
      content: payload.get("content"),
      type: payload.get("type"),
    }
  );
  toast.success(data.message);
  return data.data;
};

export const deleteTweet = async (id: string) => {
  const { data } = await API.delete(`/tweets/${id}`);
  toast.success(data.message);
};

export const toggleLike = async (id: string) => {
  const { data } = await API.put<{ data: ITweet; message: string }>(
    `/tweets/${id}/toggle-like`
  );
  toast.success(data.message);
  return data.data;
};
