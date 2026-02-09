import { cn } from '@/lib/utils';
import { motion } from 'framer-motion'
import { BookOpen, Radio, Target, Users } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface Props {
    activeTab: string;
    setActiveTab: Dispatch<SetStateAction<string>>;
}

export default function ClassroomNavbar({ activeTab, setActiveTab }: Props) {
    const sectors = [
        { id: "intel", label: "Intel", icon: Target, sub: "Assignments" },
        { id: "broadcasts", label: "Broadcasts", icon: Radio, sub: "Lectures" },
        { id: "archives", label: "Archives", icon: BookOpen, sub: "Notes" },
        { id: "roster", label: "Roster", icon: Users, sub: "Students" },
    ];

    return (
        <nav className="flex items-center gap-2 p-2 rounded-[2rem] bg-card/40 dark:bg-black/40 border border-border dark:border-white/5 backdrop-blur-2xl shadow-2xl">
            {sectors.map((sector) => {
                const IsActive = activeTab === sector.id;
                return (
                    <button
                        key={sector.id}
                        onClick={() => setActiveTab(sector.id)}
                        className={cn(
                            "relative flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-500 group",
                            IsActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {IsActive && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-2xl"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <sector.icon size={18} className={cn("relative z-10 transition-transform duration-500", IsActive && "scale-110")} />
                        <div className="relative z-10 flex flex-col items-start leading-none text-left">
                            <span className="text-[10px] font-bold font-oswald uppercase tracking-widest">{sector.label}</span>
                            <span className="text-[8px] font-medium opacity-50 uppercase tracking-tighter">{sector.sub}</span>
                        </div>
                    </button>
                );
            })}
        </nav>
    );
};
