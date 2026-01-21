import { Skeleton } from '../ui/skeleton'

const TweetSkeletonList = ({ count = 3 }: { count: number }) => {
    return (
        // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-8 pb-4 w-full" >
        <>
            {Array.from({ length: count }).map((_, idx) => (
                <Skeleton key={idx} className="h-60 w-full rounded-xl p-4 flex flex-col  space-y-4" >

                    {/* user info  */}
                    <Skeleton className="flex items-center justify-start space-x-4 ">

                        {/* image */}
                        <Skeleton className="rounded-full h-12 aspect-square bg-neutral-300 " />
                        {/* user deatils */}
                        <Skeleton className="rounded-full w-full flex items-start justify-between flex-col space-y-2">
                            {/* title */}
                            <Skeleton className="h-4 w-6/10 bg-neutral-300" />
                            {/* userName */}
                            <Skeleton className="w-8/10 bg-neutral-300 h-2" />
                        </Skeleton>

                    </Skeleton>
                    <Skeleton className="w-full bg-neutral-300 h-8" />
                    <Skeleton className="w-full bg-neutral-300 h-24" />
                    <Skeleton className="w-full bg-neutral-300 h-1" />
                    <Skeleton className="flex h-8 w-full space-x-2">
                        <Skeleton className="w-1/5 bg-neutral-300 h-full" />
                        <Skeleton className="w-1/4 bg-neutral-300 h-full" />
                        <Skeleton className="w-1/4 bg-neutral-300 h-full" />
                    </Skeleton>
                </Skeleton>
            ))}
        {/* </div> */}
        </>
    )
}

export default TweetSkeletonList