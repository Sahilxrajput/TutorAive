import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    SquarePen,
    Filter,
    Cpu,
    ShieldCheck,
    Sparkles,
    Hash
} from "lucide-react";
import { useTweets } from "@/tanStack/hooks/useTweets";
import { useSearchShortcut } from "@/hooks/useSearchShortcut";
import TweetSkeletonList from "@/components/community/TweetSkeletonList";
import TweetFilters from "@/components/community/TweetFilters";
import TweetCreateDialog from "@/components/community/TweetCreate";
import TweetCard from "@/components/community/TweetCard";

// const TweetCard = forwardRef(({ tweet }, ref) => (
//     <motion.div
//         ref={ref}
//         layout
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         whileHover={{ y: -5 }}
//         className="bg-card/60 dark:bg-neutral-900/40 backdrop-blur-xl border border-border dark:border-white/5 rounded-[2rem] p-6 shadow-xl transition-all duration-500 hover:border-primary/30"
//     >
//         <div className="flex gap-4">
//             <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex-shrink-0 flex items-center justify-center text-primary font-bold font-oswald">
//                 {tweet.author?.name?.charAt(0) || "U"}
//             </div>
//             <div className="flex-1 space-y-2">
//                 <div className="flex justify-between items-start">
//                     <div>
//                         <h4 className="font-bold font-inter text-sm text-foreground">{tweet.author?.name}</h4>
//                         <p className="text-[10px] text-muted-foreground uppercase font-oswald tracking-widest">@{tweet.author?.username}</p>
//                     </div>
//                     <div className="px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[8px] font-bold uppercase tracking-tighter">
//                         {tweet.type || "General"}
//                     </div>
//                 </div>
//                 <p className="text-sm text-muted-foreground leading-relaxed font-inter">
//                     {tweet.content}
//                 </p>
//                 <div className="pt-4 flex items-center gap-6 opacity-50">
//                     <div className="flex items-center gap-1 text-[10px] font-bold font-oswald uppercase tracking-widest"><MessageSquare size={12} /> 12</div>
//                     <div className="flex items-center gap-1 text-[10px] font-bold font-oswald uppercase tracking-widest text-primary"><Zap size={12} fill="currentColor" /> 42</div>
//                 </div>
//             </div>
//         </div>
//     </motion.div>
// ));

export default function TweetFeed() {
    const [filter, setFilter] = useState("all");
    const [isCreating, setIsCreating] = useState(false);
    const [search, setSearch] = useState("");

    const containerRef = useRef(null);
    const isFetchingRef = useRef(false);
    const searchInputRef = useRef(null);

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
            (el as HTMLElement).scrollTop + (el as HTMLElement).clientHeight >= (el as HTMLElement).scrollHeight - 50 &&
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


    return (
        <div className="min-h-screen transition-colors duration-500 relative overflow-hidden p-6 md:p-10 lg:p-12">

            {/* Background Energy Glows */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[140px] rounded-full z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full z-10 pointer-events-none" />

            <div className="max-w-6xl mx-auto flex flex-col gap-12 h-full" >

                {/* Header Sector */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-border/40 pb-10">
                    <div className="space-y-2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-primary"
                        >
                            <Hash size={16} className="animate-pulse" />
                            <span className="text-[10px] font-bold font-oswald uppercase tracking-[0.4em]">Subspace Comms</span>
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-bold font-cinzel tracking-tighter text-foreground uppercase">
                            Community. <span className="text-primary italic">Logs.</span>
                        </h1>
                    </div>

                    <div className="w-full max-w-md relative group">
                        <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-center bg-card/40 dark:bg-black/40 border border-border dark:border-white/5 rounded-2xl backdrop-blur-2xl px-5 py-3">
                            <Search className="text-primary mr-3" size={18} />
                            <input
                                ref={searchInputRef}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="SCAN LOG DATA..."
                                className="bg-transparent border-none outline-none w-full font-oswald tracking-widest text-[10px] uppercase placeholder:opacity-30"
                            />
                            <div className="hidden sm:flex items-center gap-1.5 ml-3 opacity-30">
                                <kbd className="px-1.5 py-0.5 rounded bg-muted text-[8px] font-bold">⌘</kbd>
                                <kbd className="px-1.5 py-0.5 rounded bg-muted text-[8px] font-bold">K</kbd>
                            </div>
                        </div>
                    </div>
                </header>

                {isCreating && (
                    <TweetCreateDialog
                        _id=""
                        isOpen={isCreating}
                        setIsOpen={setIsCreating}
                    />
                )}

                {/* Comms Filters Toggle */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 text-muted-foreground">
                        <Filter size={16} />
                        <span className="text-[10px] font-bold font-oswald uppercase tracking-[0.2em]">Frequency:</span>
                        <TweetFilters active={filter} setActive={setFilter} />
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                        <span className="text-[9px] font-bold font-oswald uppercase tracking-widest text-primary">Live Sync Active</span>
                    </div>
                </div>

                {/* Infinite Grid Feed */}
                <div
                    ref={containerRef}
                    onScroll={handleScroll}
                    className="overflow-auto custom-scrollbar h-[calc(100vh-50px)]"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
                        <AnimatePresence mode="popLayout">
                            {filteredTweets.map((tweet, i) => (
                                <TweetCard
                                    key={tweet._id}
                                    tweet={tweet}
                                    index={i}
                                />
                            ))}
                        </AnimatePresence>

                        {isFetchingNextPage && (
                            [1, 2, 3].map(i => (
                                <div key={i} className="h-48 rounded-[2rem] bg-muted animate-pulse border border-border/10" />
                            ))
                        )}
                    </div>

                    {!hasNextPage && filteredTweets.length > 0 && (
                        <div className="py-12 text-center">
                            <div className="inline-block px-6 py-2 rounded-full bg-muted/30 border border-border/50 text-[10px] font-bold font-oswald text-muted-foreground uppercase tracking-[0.3em]">
                                You have reached the origin of the stream.
                            </div>
                        </div>
                    )}

                    {filteredTweets.length === 0 && !isLoading && (
                        <div className="flex flex-col items-center justify-center py-20 opacity-40">
                            <Sparkles size={48} className="mb-4 text-primary/20" />
                            <p className="font-oswald tracking-widest uppercase text-xs">Sector Silent. No data packets detected.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Action: BROADCAST COMMS */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCreating(true)}
                className="fixed bottom-10 right-10 w-16 h-16 rounded-[2rem] bg-primary text-white shadow-2xl shadow-primary/40 flex items-center justify-center group z-50 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <SquarePen size={28} />
            </motion.button>

            {/* FOOTER SYNC STATUS */}
            <div className="fixed bottom-6 left-26 hidden xl:flex items-center gap-6 opacity-30 pointer-events-none">
                <div className="flex items-center gap-2"><Cpu size={14} /> <span className="text-[8px] font-bold font-oswald uppercase tracking-widest">SFU Engine v2</span></div>
                <div className="flex items-center gap-2 text-primary"><ShieldCheck size={14} /> <span className="text-[8px] font-bold font-oswald uppercase tracking-widest">Encrypted Stream</span></div>
            </div>
        </div>
    );
}