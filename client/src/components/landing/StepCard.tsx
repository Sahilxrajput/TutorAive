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
        className="group relative p-10 rounded-[3rem] bg-neutral-900/40 border border-white/5 backdrop-blur-xl hover:border-indigo-500/30 transition-all duration-500 overflow-hidden"
    >
        {/* Step Number Background */}
        <span className="absolute -right-4 -top-4 text-[10rem] font-black text-white/[0.02] select-none pointer-events-none font-cinzel">
            {number}
        </span>

        <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-indigo-600/20 transition-all duration-500">
                <Icon className="text-indigo-400" size={32} />
            </div>

            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight font-oswald uppercase">
                {title}
            </h3>

            <p className="text-neutral-400 leading-relaxed font-light">
                {description}
            </p>

            <div className="mt-8 flex items-center gap-2 text-indigo-400 text-xs font-bold tracking-[0.2em] uppercase font-oswald opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                Learn More <ArrowRight size={14} />
            </div>
        </div>
    </motion.div>
);

export default StepCard;