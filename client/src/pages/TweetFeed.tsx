import { useMemo, useRef, useState } from "react";
import TweetFilters from "@/components/community/TweetFilters";
import TweetCard from "@/components/community/TweetCard";
import TweetCreateDialog from "@/components/community/TweetCreate";
import { SquarePen } from "lucide-react";
import { useTweets } from "@/tanStack/hooks/useTweets";
import TweetSkeletonList from "@/components/community/TweetSkeletonList";


export default function TweetFeed() {
    const [filter, setFilter] = useState<"all"| "general"| "mentorship"| "problem"| "news"| "repost">("all");
    const [isCreating, setIsCreating] = useState(false);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const isFetchingRef = useRef(false);

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useTweets();


    /* ---------------- FILTER LOGIC ---------------- */

    const filteredTweets = useMemo(() => {
        const tweets = data?.pages.flatMap(page => page.data) ?? [];

        if (filter === "all") return tweets;

        if (filter === "repost") {
            return tweets.filter(t => t.parentTweet);
        }

        return tweets.filter(t => t.type === filter);
    }, [filter, data]);


    /* ---------------- SCROLL HANDLER ---------------- */

    const handleScroll = () => {
        const el = containerRef.current;
        if (!el) return;

        if (
            el.scrollTop + el.clientHeight >= el.scrollHeight - 50 &&     // small threshold
            hasNextPage &&
            !isFetchingRef.current
        ) {
            isFetchingRef.current = true;

            fetchNextPage().finally(() => {
                requestAnimationFrame(() => {
                    if (!containerRef.current) return;
                    isFetchingRef.current = false;
                });
            });
        }
    };


    /* ---------------- INITIAL LOADING ---------------- */

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-8 pb-4 w-full" >
                <TweetSkeletonList count={9} />
            </div>
        )
    }

    /* ---------------- RENDER ---------------- */

    return (
        <div className="relative px-6 overflow-hidden">
            <TweetFilters active={filter} setActive={setFilter} />

            {isCreating && (
                <TweetCreateDialog
                    _id=""
                    isOpen={isCreating}
                    setIsOpen={setIsCreating}
                />
            )}

            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="mt-12 px-6 overflow-y-auto overflow-x-hidden h-[calc(100vh-70px)]"
            >

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-1 pb-10">
                    {filteredTweets.map(tweet => (
                        <TweetCard key={tweet._id} tweet={tweet} />
                    ))}

                    {/* Skeletons appear ONLY while next page is loading */}
                    {isFetchingNextPage && <TweetSkeletonList count={3} />}
                </div>


                {!hasNextPage && (
                    <div className="py-4 text-center text-sm text-muted-foreground">
                        You’ve reached the beginning of time.
                    </div>
                )}
            </div>

            {/* Create tweet button */}
            <button
                className="rounded-2xl fixed bottom-12 right-16 shadow-md border text-blue-500 bg-card z-50 hover:scale-105 transition"
                onClick={() => setIsCreating(true)}
            >
                <SquarePen className="m-4" />
            </button>
        </div>
    );
}
