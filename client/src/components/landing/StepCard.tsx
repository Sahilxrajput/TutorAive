import { motion } from 'framer-motion'
import { ArrowRight, type LucideIcon } from 'lucide-react';

interface Props {
    number: string,
    icon: LucideIcon,
    title: string,
    description: string,
    delay: number
}

const StepCard = ({ number, icon: Icon, title, description, delay }: Props) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay }}
        className="group relative h-full p-10 rounded-[2.5rem] bg-card dark:bg-neutral-900/40 border border-border dark:border-white/5 backdrop-blur-xl hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden flex flex-col"
    >
        <span className="absolute -right-2 -top-6 text-[10rem] font-black text-foreground/[0.03] dark:text-white/[0.02] select-none pointer-events-none font-cinzel leading-none group-hover:text-dark/20">
            {number}
        </span>

        <div className="relative z-10 flex flex-col h-full">
            <div className="w-16 h-16 rounded-2xl bg-primary/5 dark:bg-dark/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 text-primary">
                <Icon size={30} strokeWidth={1.5} />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-foreground dark:text-white mb-4 tracking-wider font-oswald uppercase">
                {title}
            </h3>

            <p className="text-muted-foreground dark:text-neutral-400 leading-relaxed font-inter font-light flex-grow">
                {description}
            </p>

            <div className="mt-8 flex items-center gap-2 text-primary text-[10px] font-bold tracking-[0.2em] uppercase font-oswald translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                Dive Deeper <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    </motion.div>
);

export default StepCard;