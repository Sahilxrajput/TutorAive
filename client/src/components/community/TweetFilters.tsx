import { Button } from "@/components/ui/button";
import type { Dispatch, SetStateAction } from "react";

interface Props {
    active: string;
    setActive: Dispatch<SetStateAction<TweetFilter>>
}

export type TweetFilter =
    | "all"
    | "general"
    | "mentorship"
    | "problem"
    | "news"
    | "repost";


const filters:  TweetFilter[] = [
    "all",
    "general",
    "mentorship",
    "problem",
    "news",
    "repost",
];
export default function TweetFilters({ active, setActive }: Props) {
    return (
        <div className="flex gap-3 px-6 pt-2 absolute left-6 top-0 z-20">
            {filters.map(f => (
                <Button
                    key={f}
                    variant={active === f ? "default" : "outline"}
                    className="capitalize"
                    onClick={() => setActive(f)}
                >
                    {f}
                </Button>
            ))}
        </div>
    );
}
