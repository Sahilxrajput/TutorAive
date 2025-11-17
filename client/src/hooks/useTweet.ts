import API from "@/lib/api";
import type { ITweet } from "@/types/auth";
import { formatDateTime } from "@/utils/splitDateTime";
import { useState } from "react";
import { toast } from "sonner";

export function useTweets() {
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [filteredTweets, setFilteredTweets] = useState<ITweet[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTweets = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/tweets");
      const formattedTweets = data.data.map((tweet: ITweet) => ({
        ...tweet,
        ...formatDateTime(tweet.createdAt),
      }));
      setTweets(formattedTweets);
      console.log("tweets", formattedTweets);
      setFilteredTweets(formattedTweets);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  const deleteTweet = async (id: string) => {
    try {
      const { data } = await API.delete(`/tweets/${id}`);

      toast.success(data.message || "Tweet deleted");

      setTweets((prev) => prev.filter((t) => t._id !== id));
      setFilteredTweets((prev) => prev.filter((t) => t._id !== id));
    } catch {
      toast.error("Something went wrong");
    }
  };

  return {
    loading,
    tweets,
    filteredTweets,
    setFilteredTweets,
    fetchTweets,
    createTweet,
    deleteTweet,
  };
}
