import { Button } from "@/components/ui/button";
import type { Dispatch, SetStateAction } from "react";


export type TweetFilter =
    | "all"
    | "general"
    | "mentorship"
    | "problem"
    | "news"
    | "repost";

interface Props {
    active: TweetFilter;
    setActive: Dispatch<SetStateAction<TweetFilter>>;
}


const filters: TweetFilter[] = [
    "all",
    "general",
    "mentorship",
    "problem",
    "news",
    "repost",
];

export default function TweetFilters({ active, setActive }: Props) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((f) => (
                <Button
                    key={f}
                    variant={active === f ? "default" : "outline"}
                    className="capitalize whitespace-nowrap"
                    onClick={() => setActive(f)}
                >
                    {f}
                </Button>
            ))}
        </div>
    );
}
