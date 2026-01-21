import {
  createRepost,
  createTweet,
  deleteTweet,
  fetchTweets,
  toggleLike,
} from "@/api/tweets.api";
import type { IAddTweetContext, ITweet } from "@/types/type";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { CACHE_KEY_TWEETS } from "../constants";
import useAuth from "@/hooks/useAuth";
import { notifyError } from "@/utils/notifyError";

// <----------------- bug------------------->
//@fix ui behaviour on creating a new post and repost

export function useTweets() {
  return useInfiniteQuery({
    queryKey: CACHE_KEY_TWEETS,
    queryFn: fetchTweets,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 60_000,
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
      };

      qc.setQueryData(CACHE_KEY_TWEETS, (old: any) => {
        if (!old?.pages?.length) return old;

        return {
          ...old,
          pages: [
            {
              ...old.pages[0],
              data: [optimisticTweet, ...old.pages[0].data],
            },
            ...old.pages.slice(1),
          ],
        };
      });

      return { previousTweets };
    },

    onSuccess: (fullTweet) => {
      qc.setQueryData(CACHE_KEY_TWEETS, (old: any) => {
        if (!old?.pages?.length) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((tweet: ITweet) =>
              tweet._id.startsWith("temp") ? fullTweet : tweet,
            ),
          })),
        };
      });
    },

    onError: (err, _vars, context) => {
      notifyError(err);
      console.log(err);
      if (context?.previousTweets)
        qc.setQueryData(CACHE_KEY_TWEETS, context.previousTweets);
    },
  });
};

export const useDeleteTweet = (tweetId: string) => {
  const qc = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: () => deleteTweet(tweetId),
    // onMutate
    onSuccess: () => {
      qc.setQueryData(CACHE_KEY_TWEETS, (prev: ITweet[] = []) =>
        prev.filter((t) => t._id !== tweetId),
      );
    },
    onError: (err) => {
      notifyError(err);
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
          tweet._id === updatedTweet._id ? updatedTweet : tweet,
        ),
      );
    },
    onError: (err) => {
      notifyError(err);
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

    onError: (err, _vars, context) => {
      qc.setQueryData(CACHE_KEY_TWEETS, context?.previousTweets ?? []);
      notifyError(err);
    },
  });
};
