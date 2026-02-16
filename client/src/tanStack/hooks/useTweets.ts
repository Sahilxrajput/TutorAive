import {
  createRepost,
  createTweet,
  deleteTweet,
  fetchTweets,
  toggleLike,
} from "@/api/tweets.api";
import type { ITweet } from "@/types/type";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { CACHE_KEY_TWEETS } from "../constants";
import useAuth from "@/hooks/useAuth";
import { notifyError } from "@/utils/notifyError";


interface ITweetsPage {
  data: ITweet[];
  nextCursor?: string | null;
}

interface IInfiniteTweets {
  pages: ITweetsPage[];
  pageParams: unknown[];
}

function updateTweetInCache(
  old: IInfiniteTweets | undefined,
  updater: (tweet: ITweet) => ITweet,
): IInfiniteTweets | undefined {
  if (!old?.pages?.length) return old;

  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      data: page.data.map(updater),
    })),
  };
}

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

  return useMutation<
    ITweet,
    Error,
    FormData,
    { previousTweets?: IInfiniteTweets }
  >({
    mutationFn: createTweet,

    onMutate: async (formData) => {
      await qc.cancelQueries({ queryKey: CACHE_KEY_TWEETS });

      const previousTweets = qc.getQueryData<IInfiniteTweets>(CACHE_KEY_TWEETS);

      const content = formData.get("content") as string;
      const type = formData.get("type") as ITweet["type"];

      const optimisticTweet: ITweet = {
        _id: "temp-" + Date.now(),
        content,
        type,
        author: user!,
        createdAt: new Date().toISOString(),
        likes: [],
      };

      qc.setQueryData<IInfiniteTweets>(CACHE_KEY_TWEETS, (old) => {
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
      qc.setQueryData<IInfiniteTweets>(CACHE_KEY_TWEETS, (old) =>
        updateTweetInCache(old, (tweet) =>
          tweet._id.startsWith("temp") ? fullTweet : tweet,
        ),
      );
    },

    onError: (err, _vars, context) => {
      notifyError(err);
      if (context?.previousTweets) {
        qc.setQueryData(CACHE_KEY_TWEETS, context.previousTweets);
      }
    },
  });
};

export const useDeleteTweet = (tweetId: string) => {
  const qc = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: () => deleteTweet(tweetId),

    onSuccess: () => {
      qc.setQueryData<IInfiniteTweets>(CACHE_KEY_TWEETS, (old) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.filter((t) => t._id !== tweetId),
          })),
        };
      });
    },

    onError: (err) => {
      notifyError(err);
    },
  });
};

export const useLikeTweet = () => {
  const qc = useQueryClient();

  return useMutation<ITweet, Error, string>({
    mutationFn: toggleLike,

    onSuccess: (updatedTweet) => {
      qc.setQueryData<IInfiniteTweets>(CACHE_KEY_TWEETS, (old) =>
        updateTweetInCache(old, (tweet) =>
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

  return useMutation<
    ITweet,
    Error,
    FormData,
    { previousTweets?: IInfiniteTweets }
  >({
    mutationFn: createRepost,

    onMutate: async (formData) => {
      await qc.cancelQueries({ queryKey: CACHE_KEY_TWEETS });

      const previousTweets = qc.getQueryData<IInfiniteTweets>(CACHE_KEY_TWEETS);

      const content = formData.get("content") as string;

      const optimisticRepost: ITweet = {
        _id: "temp-" + Date.now(),
        content,
        type: "repost",
        author: user!,
        createdAt: new Date().toISOString(),
        likes: [],
      };

      qc.setQueryData<IInfiniteTweets>(CACHE_KEY_TWEETS, (old) => {
        if (!old?.pages?.length) return old;

        return {
          ...old,
          pages: [
            {
              ...old.pages[0],
              data: [optimisticRepost, ...old.pages[0].data],
            },
            ...old.pages.slice(1),
          ],
        };
      });

      return { previousTweets };
    },

    onSuccess: (fullRepost) => {
      qc.setQueryData<IInfiniteTweets>(CACHE_KEY_TWEETS, (old) =>
        updateTweetInCache(old, (t) =>
          t._id.startsWith("temp") ? fullRepost : t,
        ),
      );
    },

    onError: (err, _vars, context) => {
      notifyError(err);
      if (context?.previousTweets) {
        qc.setQueryData(CACHE_KEY_TWEETS, context.previousTweets);
      }
    },
  });
};
