import { motion } from 'framer-motion'
import type { ComponentType } from 'react'

interface Props {
    icon: ComponentType<{ size?: number | string; className?: string; strokeWidth?: number | string }>,
    title: string,
    description: string,
    delay: number
}

const FeatureCard = ({ icon: Icon, title, description, delay }: Props) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
            duration: 0.5,
            delay: delay * 0.1,
            ease: [0.215, 0.61, 0.355, 1]
        }}
        className="group relative p-8 rounded-[2.5rem] bg-card/60 dark:bg-neutral-900/40 backdrop-blur-md border border-border dark:border-white/5 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full"
    >
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10 flex flex-col h-full">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary transition-all duration-500 shadow-sm">
                <Icon
                    className="text-primary group-hover:text-white transition-colors duration-500"
                    size={26}
                    strokeWidth={1.5}
                />
            </div>

            <h3 className="text-lg font-bold mb-3 text-foreground dark:text-white font-oswald tracking-wide uppercase">
                {title}
            </h3>

            <p className="text-muted-foreground dark:text-neutral-400 leading-relaxed text-sm font-inter font-light flex-grow">
                {description}
            </p>

            <div className="mt-6 w-8 h-[2px] bg-primary/20 group-hover:w-16 group-hover:bg-primary transition-all duration-500" />
        </div>
    </motion.div>
);

export default FeatureCard;