import { useEffect, useState } from "react";
import TweetFilters from "@/components/community/TweetFilters";
import TweetCreate from "@/components/community/TweetCreate";
import type { ITweet } from "@/types/auth";
import { SquarePen } from "lucide-react";
import TweetCard from "@/components/community/TweetCard";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/utils/splitDateTime";
import { toast } from "sonner";
import API from "@/lib/api";

export default function CommunityPage() {
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const [filteredTweets, setFilteredTweets] = useState<ITweet[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("all");
    const [isCreating, setIsCreating] = useState<boolean>(false)

    // const { fetchTweets, filteredTweets, setFilteredTweets, deleteTweet, tweets, loading } = useTweets()

    const fetchTweets = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/tweets");
            const formattedTweets = data.data.map((tweet: ITweet) => ({
                ...tweet,
                ...formatDateTime(tweet.createdAt),
            }));
            console.log("tweets -> ", formattedTweets)
            setTweets(formattedTweets);
            setFilteredTweets(formattedTweets);
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const deleteTweet = async (id: string) => {
        try {
            await toast.promise(API.delete(`/tweets/${id}`),
                {
                    loading: "Deleting tweet...",
                    success: "Tweet deleted",
                    error: "Something went wrong"
                }
            );
            setTweets((prev) => prev.filter((t) => t._id !== id));
            setFilteredTweets((prev) => prev.filter((t) => t._id !== id));
        } catch {
            toast.error("Something went wrong");
        }
    };

    const LikeTweet = async (id: string) => {
        const { data } = await API.post(`/tweets/${id}/toggle-like`)
        toast.success(data.message)
    }

    useEffect(() => {
        if (filter === "all") {
            setFilteredTweets(tweets);
            return
        }
        setFilteredTweets(tweets.filter((t: ITweet) => t.type === filter));
    }, [filter, tweets]);
    //  @remind

    useEffect(() => {
        fetchTweets()
    }, [])


    if (loading) {
        return (
            <div className="grid sm:grid-cols-2 p-8 pb-4 lg:grid-cols-3 gap-4" >
                {
                    Array.from({ length: 9 }).map((_, i) => (
                        <Skeleton key={i} className="h-60 w-full rounded-xl p-4 flex flex-col  space-y-4" >

                            {/* user info  */}
                            <Skeleton className="flex items-center justify-start space-x-4 ">

                                {/* image */}
                                <Skeleton className="rounded-full h-12 aspect-square bg-red-500" />
                                {/* user deatils */}
                                <Skeleton className="rounded-full w-full flex items-start justify-between flex-col space-y-2">
                                    {/* title */}
                                    <Skeleton className="h-4 w-6/10 bg-yellow-500" />
                                    {/* username */}
                                    <Skeleton className="w-8/10 bg-yellow-500 h-2" />
                                </Skeleton>

                            </Skeleton>
                            <Skeleton className="w-full bg-yellow-500 h-8" />
                            <Skeleton className="w-full bg-yellow-500 h-24" />
                            <Skeleton className="w-full bg-yellow-500 h-1" />
                            <Skeleton className="flex h-8 w-full space-x-2">
                                <Skeleton className="w-1/5 bg-yellow-500 h-full" />
                                <Skeleton className="w-1/4 bg-yellow-500 h-full" />
                                <Skeleton className="w-1/4 bg-yellow-500 h-full" />
                            </Skeleton>
                            {/* <Skeleton className="w-2 00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000bg-yellow-500 h-8" /> */}
                        </Skeleton>
                    ))
                }
            </div >
        )
    }

    return (
        <div className="px-6 relative">
            <TweetFilters active={filter} setActive={setFilter} />
            {isCreating && <TweetCreate isCreating={isCreating} setIsCreating={setIsCreating} />}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-1 pb-10">
                {filteredTweets.map(t => (
                    <TweetCard key={t._id} tweet={t} onDelete={deleteTweet} onLike={LikeTweet} />
                ))}
            </div>

            {/* fixed button for creating tweet */}
            <button
                className="rounded-2xl fixed bottom-12 right-16 shadow-md hover:shadow-lg border-1 text-blue-500 hover:text-blue-700 hover:scale-105 duration-100 transition-all p-4"
                onClick={() => setIsCreating(!isCreating)}
            >
                <SquarePen />
            </button>
        </div>
    );
}
