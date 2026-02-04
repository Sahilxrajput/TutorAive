import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface Props {
    icon: LucideIcon
    subTitle: string,
    title: string,
    styleName: string,
    iconColor?: "blue" | "green" | "yellow" | "purple" | "indigo" | "primary",
    dir?: 'postive' | 'negative'
}

const FloatingBadge = ({ icon: Icon, title, subTitle, styleName, dir = 'postive', iconColor = 'primary' }: Props) => {

    const colorMap = {
        primary: "text-primary bg-primary/10 border-primary/20",
        blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        green: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        yellow: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
        indigo: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    };

    const yCoordinates: number[] = dir === 'postive' ? [0, 15, 0] : [0, -15, 0];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            animate={{ y: yCoordinates }}
            whileHover={{ scale: 1.05, rotate: dir === 'postive' ? 1 : -1 }}
            transition={{
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 0.3 },
                opacity: { duration: 0.8 }
            }}
            className={cn(
                "absolute hidden lg:flex items-center gap-3 bg-card/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-border dark:border-white/10 p-3 pr-5 rounded-2xl shadow-xl z-0 transition-all duration-500 min-w-[170px]",
                styleName
            )}
        >
            <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center border shrink-0",
                colorMap[iconColor]
            )}>
                <Icon size={20} strokeWidth={1.5} />
            </div>

            <div className="flex flex-col justify-center overflow-hidden">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] font-oswald truncate">
                    {title}
                </span>
                <span className="text-[13px] font-bold text-foreground dark:text-white leading-tight font-inter whitespace-nowrap">
                    {subTitle}
                </span>
            </div>

            {/* Status Dot */}
            <div className="absolute top-2 right-2 flex h-1.5 w-1.5">
                <span className={cn(
                    "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                    iconColor === 'primary' ? 'bg-primary' : `bg-${iconColor}-400`
                )}></span>
                <span className={cn(
                    "relative inline-flex rounded-full h-1.5 w-1.5",
                    iconColor === 'primary' ? 'bg-primary' : `bg-${iconColor}-500`
                )}></span>
            </div>
        </motion.div>
    )
}

export default FloatingBadge;