import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Props {
    title: string,
    subtitle: string,
    icon: LucideIcon,
    color?: string

}

const SectorHeader = ({ title, subtitle, icon: Icon, color = "primary" }: Props) => (
    <div className="flex items-center gap-4 border-b border-border/40 pb-6 mb-10">
        <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center border",
            `bg-${color}/10 border-${color}/20 text-${color}`
        )}>
            <Icon size={24} />
        </div>
        <div className="flex flex-col">
            <h2 className="text-2xl font-bold font-cinzel tracking-wider text-foreground uppercase">{title}</h2>
            <p className="text-[10px] font-bold font-oswald text-muted-foreground uppercase tracking-widest">{subtitle}</p>
        </div>
    </div>
);

export default SectorHeader;