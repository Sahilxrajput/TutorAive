import { Skeleton } from '../ui/skeleton';

const LectureCardSkeleton = () => {
    return (
        <div
            className={
                "p-6 rounded-4xl border border-border dark:border-white/5 bg-card/60 dark:bg-neutral-900/40 backdrop-blur-xl shadow-2xl"
            }
        >
            {/* STATUS HEADER SKELETON */}
            <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-6 w-24 rounded-full" /> {/* Status Badge */}
                <Skeleton className="h-8 w-8 rounded-lg" /> {/* Menu Dots */}
            </div>

            {/* MAIN CONTENT SKELETON */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" /> {/* Title */}
                    <Skeleton className="h-3 w-1/3" /> {/* Classroom Title */}
                </div>

                <div className="py-2 border-y border-border/40 dark:border-white/5">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-md" /> {/* Icon */}
                        <Skeleton className="h-3 w-32" /> {/* Date/Time String */}
                    </div>
                </div>
            </div>

            {/* ACTION FOOTER SKELETON */}
            <div className="mt-6 flex items-center justify-between">
                <Skeleton className="h-3 w-20" /> {/* "View Details" text area */}
                <Skeleton className="h-8 w-8 rounded-xl" /> {/* Action Arrow/Button */}
            </div>
        </div>
    );
};

export default LectureCardSkeleton