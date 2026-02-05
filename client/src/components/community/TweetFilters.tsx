import { cn } from "@/lib/utils";
import { Cpu, Globe, Radio, ShieldCheck } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface Props {
    active: string;
    setActive: Dispatch<SetStateAction<string>>;
}

const filters = [
    { id: "all", label: "Global", icon: Globe },
    { id: "mentorship", label: "Guidance", icon: ShieldCheck },
    { id: "problem", label: "Errors", icon: Cpu },
    { id: "news", label: "Updates", icon: Radio },
];

export default function TweetFilters({ active, setActive }: Props) {
    return (
        <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
                <button
                    key={f.id}
                    onClick={() => setActive(f.id)}
                    className={cn(
                        "flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-bold font-oswald uppercase tracking-widest transition-all border",
                        active === f.id
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                            : "bg-muted/50 text-muted-foreground border-transparent hover:border-border"
                    )}
                >
                    <f.icon size={12} />
                    {f.label}
                </button>
            ))}
        </div>
    );
};
