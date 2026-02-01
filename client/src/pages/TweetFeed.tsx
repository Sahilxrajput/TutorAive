import { useEffect, useMemo, useRef, useState } from "react";
import TweetFilters from "@/components/community/TweetFilters";
import TweetCard from "@/components/community/TweetCard";
import TweetCreateDialog from "@/components/community/TweetCreate";
import { SearchIcon, SquarePen } from "lucide-react";
import { useTweets } from "@/tanStack/hooks/useTweets";
import TweetSkeletonList from "@/components/community/TweetSkeletonList";
import { useSearchShortcut } from "@/hooks/useSearchShortcut";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";


export default function TweetFeed() {
    const [filter, setFilter] = useState<
        "all" | "general" | "mentorship" | "problem" | "news" | "repost"
    >("all");
    const [isCreating, setIsCreating] = useState(false);
    const [search, setSearch] = useState("");

    const containerRef = useRef<HTMLDivElement | null>(null);
    const isFetchingRef = useRef(false);
    const searchInputRef = useRef<HTMLInputElement | null>(null);


    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useTweets();
    const { register } = useSearchShortcut();

    /* ---------------- FILTER LOGIC ---------------- */
    // @todo only search apply to load tweets not on all 
    const filteredTweets = useMemo(() => {
        let tweets = data?.pages.flatMap(page => page.data) ?? [];

        // ----- FILTERS -----
        if (filter === "repost") {
            tweets = tweets.filter(t => t.parentTweet);
        } else if (filter !== "all") {
            tweets = tweets.filter(t => t.type === filter);
        }

        // ----- SEARCH -----
        if (search.trim()) {
            const q = search.toLowerCase();

            tweets = tweets.filter(t =>
                t.content?.toLowerCase().includes(q) ||
                t.author?.name?.toLowerCase().includes(q) ||
                t.author?.username?.toLowerCase().includes(q)
            );
        }
        return tweets;
    }, [data, filter, search]);

    /* ---------------- SCROLL HANDLER ---------------- */

    const handleScroll = () => {
        const el = containerRef.current;
        if (!el) return;

        if (
            el.scrollTop + el.clientHeight >= el.scrollHeight - 50 &&
            hasNextPage &&
            !isFetchingRef.current
        ) {
            isFetchingRef.current = true;

            fetchNextPage().finally(() => {
                requestAnimationFrame(() => {
                    isFetchingRef.current = false;
                });
            });
        }
    };

    /* ----------------  ctrl + k  ---------------- */

    useEffect(() => {
        register(searchInputRef.current);
        return () => register(null);
    }, [register]);

    /* ---------------- INITIAL LOADING ---------------- */

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                <TweetSkeletonList count={9} />
            </div>
        );
    }

    /* ---------------- RENDER ---------------- */

    return (
        <div className="relative flex flex-col gap-4 px-4 sm:px-6 w-full h-full">

            <div className="w-full z-20 bg-[#FEFEF7] flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pt-2">
                <TweetFilters
                    active={filter}
                    setActive={setFilter}
                />
                {/* Search */}
                <div className="max-w-2xl sm:max-w-2xl">
                    <InputGroup>
                        <InputGroupInput
                            ref={searchInputRef}
                            placeholder="Search tweets..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <InputGroupAddon>
                            <SearchIcon className="w-4 h-4" />
                        </InputGroupAddon>
                        <InputGroupAddon
                            align="inline-end"
                            className="hidden sm:flex gap-1"
                        >
                            <Kbd>⌘</Kbd>
                            <Kbd>K</Kbd>
                        </InputGroupAddon>
                    </InputGroup>

                </div>
            </div>

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
                className="w-full overflow-y-auto h-[calc(100vh-80px)] pr-1"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
                    {filteredTweets.map((tweet) => (
                        <TweetCard key={tweet._id} tweet={tweet} />
                    ))}

                    {isFetchingNextPage && <TweetSkeletonList count={3} />}
                </div>

                {!hasNextPage && (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                        You’ve reached the beginning of time.
                    </div>
                )}
            </div>

            {/* Create tweet button */}
            <button
                onClick={() => setIsCreating(true)}
                className="fixed lg:bottom-6 bottom-16 right-6 sm:bottom-20 sm:right-10 rounded-2xl border bg-card text-blue-500 shadow-md hover:scale-105 transition z-50"
            >
                <SquarePen className="m-4" />
            </button>
        </div>
    );
}
