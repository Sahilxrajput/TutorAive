import { useEffect, useState } from "react";
import TweetFilters from "@/components/community/TweetFilters";
import type { ITweet } from "@/types/auth";
import { SquarePen } from "lucide-react";
import TweetCard from "@/components/community/TweetCard";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/utils/splitDateTime";
import { toast } from "sonner";
import API from "@/lib/api";
import TweetCreateDialog from "@/components/community/TweetCreate";
import LoadingSkeltons from "@/components/community/LoadingSkeltons";

export default function CommunityPage() {
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const [filteredTweets, setFilteredTweets] = useState<ITweet[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("all");
    const [isCreating, setIsCreating] = useState<boolean>(false)



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
        if (filter === "repost") {
            const t = tweets.filter((t: ITweet) => t.parentTweet)
            setFilteredTweets(t)
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
            <LoadingSkeltons />
        )
    }

    return (
        <div className="px-6 relative">
            <TweetFilters active={filter} setActive={setFilter} />
            {isCreating && <TweetCreateDialog isOpen={isCreating} setIsOpen={setIsCreating} />}
            <div  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-1 pb-10">
                {filteredTweets.map(t => (
                    <TweetCard key={t._id} isRepost={!!t.parentTweet} tweet={t} onDelete={deleteTweet} onLike={LikeTweet} />
                ))}
            </div>

            {/* fixed button for creating tweet */}
            <button
                className="rounded-2xl fixed bottom-12 right-16 shadow-md hover:shadow-lg border-1 text-blue-500 hover:text-blue-700 bg-card z-50 hover:scale-105 duration-100 transition-all p-4"
                onClick={() => setIsCreating(!isCreating)}
            >
                <SquarePen />
            </button>
        </div>
    );
}
