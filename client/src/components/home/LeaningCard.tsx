import React from "react";
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LearningCardProps {
    Icon: React.ElementType;
    title: string;
    number: number | string;
    delay?: number;
    iconColor?: "indigo" | "green" | "primary";
}

const LearningCard: React.FC<LearningCardProps> = ({
    Icon,
    title,
    number,
    iconColor = "primary",
    delay = 0
}) => {

    const colorMap = {
        primary: "text-primary bg-primary/10 border-primary/20",
        indigo: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
        green: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.5,
                delay,
                ease: [0.16, 1, 0.3, 1] 
            }}
            whileHover={{ y: -5 }}
            className={cn(
                "relative group overflow-hidden p-6 rounded-[2.5rem]",
                "bg-card/60 dark:bg-neutral-900/40 backdrop-blur-xl",
                "border border-border dark:border-white/5 shadow-2xl transition-all duration-500",
                "hover:border-primary/30 hover:shadow-primary/5"
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="flex flex-col items-center text-center relative z-10">
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner",
                    colorMap[iconColor]
                )}>
                    <Icon size={22} strokeWidth={1.5} />
                </div>

                <h3 className="text-[9px] font-bold font-oswald text-muted-foreground uppercase tracking-[0.25em] mb-2">
                    {title}
                </h3>

                <p className="text-3xl font-bold text-foreground dark:text-white font-cinzel tracking-tighter leading-none">
                    {number}
                </p>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-primary/20 group-hover:w-16 transition-all duration-500 rounded-full" />
        </motion.div>
    )
}

export default LearningCard;