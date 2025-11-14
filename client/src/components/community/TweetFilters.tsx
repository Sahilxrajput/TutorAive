import { Button } from "@/components/ui/button";

interface Props {
    active: string;
    setActive: (v: string) => void;
}

const filters = ["all", "general", "mentorship", "problem", "news"];

export default function TweetFilters({ active, setActive }: Props) {
    return (
        <div className="flex gap-3 pb-2 pt-4 bg-card sticky mb-4 left-0 top-0 z-10">
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
