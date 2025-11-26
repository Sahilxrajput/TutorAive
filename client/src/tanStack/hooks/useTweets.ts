import {
  createRepost,
  createTweet,
  deleteTweet,
  fetchTweets,
  toggleLike,
} from "@/api/tweets.api";
import type {
  IAddTweetContext,
  ITweet,
} from "@/types/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_TWEETS } from "../constants";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";


// <----------------- bug------------------->
//@fix ui behaviour on creating a new post and repost

export function useTweets() {
  //@todo limit vise fetching
  return useQuery({
    queryKey: CACHE_KEY_TWEETS,
    queryFn: fetchTweets,
  });
}

export const useCreateTweet = () => {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation<ITweet, Error, FormData, IAddTweetContext>({
    mutationFn: (formData) => createTweet(formData),

    onMutate: async (formData) => {
      await qc.cancelQueries({ queryKey: CACHE_KEY_TWEETS }); //@remind

      const previousTweets = qc.getQueryData<ITweet[]>(CACHE_KEY_TWEETS) ?? [];

      const content = formData.get("content") as string;
      const type = formData.get("type") as
        | "general"
        | "mentorship"
        | "news"
        | "problem";

      const optimisticTweet: ITweet = {
        _id: "temp-" + Date.now(),
        content,
        type,
        author: user!,
        createdAt: new Date().toISOString(),
        likes: [],
        // timeStr: "123",
        // dateStr: "123",
      };

      qc.setQueryData<ITweet[]>(CACHE_KEY_TWEETS, (prev = []) => [
        optimisticTweet,
        ...prev,
      ]);

      return { previousTweets };
    },

    onSuccess: (fullTweet) => {
      qc.setQueryData<ITweet[]>(CACHE_KEY_TWEETS, (prev = []) => {
        return prev.map((tweet) =>
          tweet._id.startsWith("temp") ? fullTweet : tweet
        );
      });
    },

    onError: (_err, _vars, context) => {
      if (context?.previousTweets) {
        qc.setQueryData(CACHE_KEY_TWEETS, context.previousTweets);
      }
      toast.error("Failed to post tweet.");
    },

    // onSettled: () => {
    //   qc.invalidateQueries({ queryKey: CACHE_KEY_TWEETS });
    // },
  });
};

export const useDeleteTweet = (tweetId: string) => {
  const qc = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: () => deleteTweet(tweetId),
    // onMutate
    onSuccess: () => {
      qc.setQueryData(CACHE_KEY_TWEETS, (prev: ITweet[] = []) =>
        prev.filter((t) => t._id !== tweetId)
      );
    },
    onError: (err) => {
      toast.error("Something goes Wrong");
      console.log(err);
    },
  });
};

export const useLikeTweet = () => {
  const qc = useQueryClient();

  return useMutation<ITweet, Error, string>({
    mutationFn: (tweetId) => toggleLike(tweetId),
    

    onSuccess: (updatedTweet) => {
      qc.setQueryData(CACHE_KEY_TWEETS, (prev: ITweet[] = []) =>
        prev.map((tweet) =>
          tweet._id === updatedTweet._id ? updatedTweet : tweet
        )
      );
    },
  });
};

export const useRepostTweet = () => {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation<ITweet, Error, FormData, IAddTweetContext>({
    mutationFn: (formData) => createRepost(formData),

    onMutate: async (formData) => {
      await qc.cancelQueries({ queryKey: CACHE_KEY_TWEETS });

      const previousTweets = qc.getQueryData<ITweet[]>(CACHE_KEY_TWEETS) ?? [];

      const content = formData.get("content") as string;
      const type = formData.get("type") as
        | "general"
        | "mentorship"
        | "news"
        | "problem"
        | "repost";

      const optimisticRepost: ITweet = {
        _id: "temp-" + Date.now(),
        content,
        type,
        author: user!,
        createdAt: new Date().toISOString(),
        // timeStr: "123",
        // dateStr: "123",
      };

      qc.setQueryData<ITweet[]>(CACHE_KEY_TWEETS, (prev = []) => [
        optimisticRepost,
        ...prev,
      ]);

      return { previousTweets };
    },

    onSuccess: (fullRepost) => {
      qc.setQueryData<ITweet[]>(CACHE_KEY_TWEETS, (prev = []) => {
        return prev.map((t) => (t._id.startsWith("temp") ? fullRepost : t));
      });
    },

    onError: (_err, _vars, context) => {
      qc.setQueryData(CACHE_KEY_TWEETS, context?.previousTweets ?? []);
      toast.error("Failed to repost tweet.");
    },
  });
};
