import { useEffect, useState } from "react";
import TweetFilters from "@/components/community/TweetFilters";
import TweetCreate from "@/components/community/TweetCreate";
import TweetList from "@/components/community/TweetList";
import API from "@/lib/api";
import type { ITweet } from "@/types/auth";
import { formatDateTime } from "@/utils/splitDateTime";
import { toast } from "sonner";
import { SquarePen } from "lucide-react";

export default function CommunityPage() {
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const [filteredTweets, setFilteredTweets] = useState<ITweet[]>([]);
    const [filter, setFilter] = useState("general");
    const [isCreating, setIsCreating] = useState<boolean>(false)

    useEffect(() => {
        const loadTweets = async () => {
            const { data } = await API.get("/tweets");
            // Assuming formatDateTime returns an object like { dateStr, timeStr }
            const formattedTweets = data.data.map((tweet: ITweet) => ({
                ...tweet,
                ...formatDateTime(tweet.createdAt),
            }));
            setTweets(formattedTweets);
            setFilteredTweets(formattedTweets.filter((t: ITweet) => t.type === filter));
        };
        loadTweets();
    }, [])

    const deleteTweet = async (id: string) => {
        try {
            const { data } = await API.delete(`/tweets/${id}`);
            if (data?.success) {
                toast.success(data.message);
                setTweets(prev => prev.filter(t => t._id !== id));
                setFilteredTweets(prev => prev.filter(t => t._id !== id));
            }
        } catch (error) {
            toast.error("Failed to delete tweet")
            console.error("Failed to delete tweet:", error);
        }
    };

    useEffect(() => {
        if (filter === "all") {
            setFilteredTweets(tweets);
            return
        }
        setFilteredTweets(tweets.filter((t: ITweet) => t.type === filter));
    }, [filter]);

    return (
        <div className="px-6 relative">
            <TweetFilters active={filter} setActive={setFilter} />
            {isCreating && <TweetCreate /> }
            <TweetList tweets={filteredTweets} onDelete={deleteTweet} />

            {/* fixed button for creating tweet */}
            <button 
            className="rounded-2xl fixed bottom-12 right-16 shadow-md hover:shadow-lg border-1 text-blue-500 hover:text-blue-700 hover:scale-105 duration-100 transition-all p-4"
            onClick={()=>setIsCreating(!isCreating)}
            >
                <SquarePen />
            </button>
        </div>
    );
}
