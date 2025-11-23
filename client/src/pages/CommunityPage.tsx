import { useEffect, useState } from "react";
import TweetFilters from "@/components/community/TweetFilters";
import type { ITweet } from "@/types/type";
import { SquarePen } from "lucide-react";
import TweetCard from "@/components/community/TweetCard";
import TweetCreateDialog from "@/components/community/TweetCreate";
import LoadingSkeltons from "@/components/community/LoadingSkeltons";
import { useTweets } from "@/tanStack/hooks/useTweets";
import useAuth from "@/hooks/useAuth";

export default function CommunityPage() {
    const [filteredTweets, setFilteredTweets] = useState<ITweet[]>([]);
    const [filter, setFilter] = useState("all");
    const [isCreating, setIsCreating] = useState<boolean>(false)


    const { data: tweets = [], isLoading } = useTweets()
    const { user } = useAuth()

    //  @todo
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

    if (isLoading) {
        return (
            <LoadingSkeltons />
        )
    }

    return (
        <div className="px-6 relative">
            <TweetFilters active={filter} setActive={setFilter} />
            {isCreating && <TweetCreateDialog _id="" isOpen={isCreating} setIsOpen={setIsCreating} />}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-1 pb-10">
                {filteredTweets.map(t => (
                    <TweetCard key={t._id} tweet={t} />
                ))}
            </div>

            {/* fixed button for creating tweet */}
            {user && <button
                className="rounded-2xl fixed bottom-12 right-16 shadow-md hover:shadow-lg border-1 text-blue-500 hover:text-blue-700 bg-card z-50 hover:scale-105 duration-100 transition-all p-4"
                onClick={() => setIsCreating(!isCreating)}
            >
                <SquarePen />
            </button>}
        </div>
    );
}

