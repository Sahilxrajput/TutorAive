import { Skeleton } from '../ui/skeleton'
import { Hash } from "lucide-react";


const TweetSkeleton = () => {
    return (
        <div className="relative bg-card/60 dark:bg-neutral-900/40 backdrop-blur-xl border border-border dark:border-white/5 rounded-[2.5rem] p-7 shadow-xl flex flex-col h-full overflow-hidden">
            {/* Background Gradient Simulation */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.01] to-transparent pointer-events-none" />

            {/* TOP BAR SKELETON */}
            <div className="flex justify-between items-center mb-6 z-10">
                <div className="flex items-center gap-2 opacity-20">
                    <Hash size={12} className="text-muted-foreground" />
                    <Skeleton className="h-2 w-24 rounded-full" />
                </div>
            </div>

            {/* MAIN CONTENT AREA SKELETON */}
            <div className="flex gap-4 mb-auto z-10">
                {/* Avatar Node */}
                <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />

                <div className="flex-1 space-y-4">
                    {/* Header: Name & Type Badge */}
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-32 rounded-full" />
                            <Skeleton className="h-2 w-20 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-14 rounded-full" />
                    </div>

                    {/* Content Lines */}
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-full rounded-full" />
                        <Skeleton className="h-3 w-[90%] rounded-full" />
                        <Skeleton className="h-3 w-[40%] rounded-full" />
                    </div>

                    {/* Visual Packet Attachment (Image Placeholder) */}
                    <Skeleton className="mt-4 w-full h-52 rounded-[1.5rem]" />
                </div>
            </div>

            {/* FOOTER SKELETON */}
            <div className="pt-6 mt-6 border-t border-border/40 dark:border-white/5 flex items-center justify-between z-10">
                <div className="flex items-center gap-6">
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-md" />
                        <Skeleton className="h-2 w-6 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-md" />
                        <Skeleton className="h-2 w-12 rounded-full" />
                    </div>
                </div>

                {/* Timestamp Cluster */}
                <div className="flex flex-col items-end gap-2 opacity-40">
                    <Skeleton className="h-2 w-16 rounded-full" />
                    <Skeleton className="h-2 w-20 rounded-full" />
                </div>
            </div>
        </div>
    );
};


const TweetSkeletonList = ({ count = 3 }: { count: number }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, idx) => (
                <div className='p-8'>
                    <TweetSkeleton key={idx} />
                </div>
            ))}
        </>
    )
}

export default TweetSkeletonList