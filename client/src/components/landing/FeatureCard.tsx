import { motion } from 'framer-motion'
import type { ComponentType } from 'react'


interface Props {
    icon: ComponentType<{ size: number; className: string }>,
    title: string,
    description: string,
    delay: number
}


const FeatureCard = ({ icon: Icon, title, description, delay }: Props) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, delay: delay * 0.1 }}
        className="group p-8 rounded-3xl bg-neutral-900/50 border border-white/5 hover:border-indigo-500/30 transition-all hover:bg-neutral-800/50"
    >
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Icon className="text-indigo-400" size={28} />
        </div>
        <h3 className="text-xl font-bold mb-3 text-white font-oswald">{title}</h3>
        <p className="text-neutral-400 leading-relaxed text-sm">{description}</p>
    </motion.div>
);

export default FeatureCard;