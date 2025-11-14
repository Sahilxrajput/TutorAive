import type { ITweet } from "@/types/auth";
import TweetCard from "./TweetCard";

interface Props {
    tweets: ITweet[];
    onDelete: (id: string) => void;
}

export default function TweetList({ tweets, onDelete }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-1 pb-10">
            {tweets.map(t => (
                <TweetCard key={t._id} tweet={t} onDelete={onDelete} />
            ))}
        </div>
    );
}
